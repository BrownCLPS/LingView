const fs = require('fs');
const parseXml = require('xml2js').parseString;
const elanReader = require('./read_elan');
const pfsxReader = require('./read_pfsx');
const mediaFinder = require('../find_media');

function updateIndex(indexMetadata, indexFileName, storyID) {
  let index = JSON.parse(fs.readFileSync(indexFileName, "utf8"));
  index[storyID] = indexMetadata;
  fs.writeFileSync(indexFileName, JSON.stringify(index, null, 2));
}

// Stretch children to fill full duration of parent.
// Specifically, if parent has P slots and child has C slots (incl gaps except final gap),
// then increase the child's slots by a factor of P/C,
// i.e., subtract parentStartSlot from everything, 
//   set each c in C to floor(c * (double) P / (double) C),
//   and then add parentStartSlot back in. 
function scaledSlot(slotIn, parentStart, tierEnd, latestEnd) {
  const parentLen = latestEnd - parentStart;
  const childLen = tierEnd - parentStart;
  let slot = slotIn - parentStart;
  slot = Math.floor(slot * parentLen / childLen);
  slot = slot + parentStart;
  return slot;
}

function assignSlots(anotID, tiersToConstraints,
    annotationChildren, annotationsFromIDs, timeslots, startSlots, endSlots) {
  assignSlotsHelper(anotID, 0, tiersToConstraints,
    annotationChildren, annotationsFromIDs, timeslots, startSlots, endSlots);
  // At this point, startSlots and endSlots contain the smallest allowable slot value.
  stretchSlots(anotID, 0, tiersToConstraints,
    annotationChildren, annotationsFromIDs, timeslots, startSlots, endSlots);
}

function assignSlotsHelper(anotID, parentStartSlot, tiersToConstraints,
    annotationChildren, annotationsFromIDs, timeslots, startSlots, endSlots) {
  startSlots[anotID] = parentStartSlot;
  let latestEndSlot = parentStartSlot + 1;
  for (const depTierName in annotationChildren[anotID]) {
    if (annotationChildren[anotID].hasOwnProperty(depTierName)) {
      let slotNum = parentStartSlot;
      
      let prevTimeslot = null; // used for detecting gaps
      let maybeGaps = (tiersToConstraints[depTierName] === 'Included_In');
      if (maybeGaps) {
        prevTimeslot = elanReader.getAlignableAnnotationStartSlot(annotationsFromIDs[anotID]);
      }
      
      const depAnotIDs = annotationChildren[anotID][depTierName];
      for (depAnotID of depAnotIDs) {
        if (maybeGaps) {
          const startTimeslot = elanReader.getAlignableAnnotationStartSlot(annotationsFromIDs[depAnotID]);
          if (startTimeslot !== prevTimeslot 
            && timeslots[startTimeslot] !== timeslots[prevTimeslot]) {
            slotNum++;  
          }
          prevTimeslot = elanReader.getAlignableAnnotationEndSlot(annotationsFromIDs[depAnotID]);
        }
        
        assignSlotsHelper(depAnotID, slotNum, tiersToConstraints, annotationChildren, 
            annotationsFromIDs, timeslots, startSlots, endSlots);
        slotNum = endSlots[depAnotID];
        latestEndSlot = Math.max(latestEndSlot, slotNum);
      }
    }
  }
  
  // make parent's end slot at least as late as its child's
  endSlots[anotID] = latestEndSlot;
}

// Stretch children to fill full duration of parent.
// prevStretch: the total increase in the parent's startslot due to stretch
function stretchSlots(anotID, prevStretch, tiersToConstraints,
    annotationChildren, annotationsFromIDs, timeslots, startSlots, endSlots) {
  for (const depTierName in annotationChildren[anotID]) {
    if (annotationChildren[anotID].hasOwnProperty(depTierName)) {
      const depAnotIDs = annotationChildren[anotID][depTierName];
      const tierEnd = endSlots[depAnotIDs[depAnotIDs.length - 1]] + prevStretch;
      const parentStart = startSlots[anotID];
      const parentEnd = endSlots[anotID];
      for (depAnotID of depAnotIDs) {
        const origStart = startSlots[depAnotID];
        const newStart = scaledSlot(origStart + prevStretch, parentStart, tierEnd, parentEnd);
        startSlots[depAnotID] = newStart;
        const scaledEnd = scaledSlot(endSlots[depAnotID] + prevStretch, parentStart, tierEnd, parentEnd);
        endSlots[depAnotID] = scaledEnd;
        stretchSlots(depAnotID, newStart - origStart, tiersToConstraints, 
            annotationChildren, annotationsFromIDs, timeslots, startSlots, endSlots);
      }
    }
  }
}

function preprocess(adocIn, pfsxIn, jsonFilesDir, xmlFileName, callback) {
  const storyID = elanReader.getDocID(adocIn);
  const indexMetadata = mediaFinder.improveElanIndexData(xmlFileName, storyID, adocIn);
  const jsonOut = {
    "metadata": indexMetadata,
    "sentences": []
  };
  jsonOut.metadata["tier IDs"] = {};
  jsonOut.metadata["speaker IDs"] = {};
  jsonOut.metadata["story ID"] = storyID; // TODO is this needed?

  const tiers = elanReader.getNonemptyTiers(adocIn);
  const indepTiers = tiers.filter((tier) => elanReader.getParentTierName(tier) == null);
  
  // record whether each tier is subdivided
  for (let i = 0; i < tiers.length; i++) {
    const tier = tiers[i];
    const tierName = elanReader.getTierName(tier);
    jsonOut.metadata["tier IDs"][tierName] = {
      subdivided: elanReader.isTierSubdivided(tierName, tiers),
    };
  }
  
  // tiersToConstraints: tierName -> constraintName
  // (to generate, first create typesToConstraints: linguisticTypeName -> constraintName)
  const typesToConstraints = {};
  const linguisticTypes = adocIn.LINGUISTIC_TYPE
  for (const lingType of linguisticTypes) {
    const lingTypeID = lingType.$.LINGUISTIC_TYPE_ID;
    const constraintName = lingType.$.CONSTRAINTS || '';
    typesToConstraints[lingTypeID] = constraintName;
  }
  const tiersToConstraints = {};
  for (const tier of tiers) {
    const tierName = elanReader.getTierName(tier);
    const linguisticType = tier.$.LINGUISTIC_TYPE_REF;
    const constraintName = typesToConstraints[linguisticType];
    tiersToConstraints[tierName] = constraintName;
  }
  // console.log(`tiersToConstraints: ${tiersToConstraints}`);
  
  const untimedTiers = tiers.filter(tier => 
    (tiersToConstraints[elanReader.getTierName(tier)] === 'Symbolic_Subdivision' 
    || tiersToConstraints[elanReader.getTierName(tier)] === 'Symbolic_Association')
  );
  
  // annotationChildren: parentAnnotationID -> childTierName(very sparse) -> listof childAnnotationID
  const annotationChildren = {};
  for (const tier of untimedTiers) {
    const childTierName = elanReader.getTierName(tier);
    // console.log(`adding untimed child tier ${childTierName} to annotationChildren`);
    for (const annotation of elanReader.getAnnotations(tier)) {
      const childAnnotationID = elanReader.getAnnotationID(annotation);
      let parentAnnotationID = annotation.REF_ANNOTATION[0].$.ANNOTATION_REF; 
      
      if (annotationChildren[parentAnnotationID] == null) {
        annotationChildren[parentAnnotationID] = {}
      }
      if (annotationChildren[parentAnnotationID][childTierName] == null) {
        annotationChildren[parentAnnotationID][childTierName] = [];
      }
      annotationChildren[parentAnnotationID][childTierName].push(childAnnotationID);
    }
  }
  
  const annotationsFromIDs = elanReader.getAnnotationIDMap(tiers);
  const timeslots = elanReader.getDocTimeslotsMap(adocIn);
  
  // sort untimed children
  for (const parentAnnotationID in annotationChildren) {
    if (annotationChildren.hasOwnProperty(parentAnnotationID)) {
      for (const childTierName in annotationChildren[parentAnnotationID]) {
        const childIDs = annotationChildren[parentAnnotationID][childTierName];
        let sortedChildIDs = [];
        const constraint = tiersToConstraints[childTierName];
        if (constraint === 'Symbolic_Association') { // 1-1 association
          // assert childIDs.length === 1; 
          sortedChildIDs = childIDs;
        } else if (constraint === 'Symbolic_Subdivision') { // untimed subdivision, ordered
          let prev = '';
          for (const id of childIDs) {
            const cur = childIDs.find(a => 
              prev === (annotationsFromIDs[a].REF_ANNOTATION[0].$.PREVIOUS_ANNOTATION || '')
            );
            sortedChildIDs.push(cur);
            prev = cur;
          }
        } else { // this should never happen
          console.log(`WARNING: missing or unrecognized ELAN stereotype for tier ${childTierName}. Annotations may display out of order.`);
          sortedChildIDs = childIDs;
        }
        
        annotationChildren[parentAnnotationID][childTierName] = sortedChildIDs;
      }
    }
  }
  
  const tierChildren = elanReader.getTierChildrenMap(tiers);
  
  // add sorted 'Time_Subdivision' children
  for (const parentTier of tiers) {
    const childTierNames = tierChildren[elanReader.getTierName(parentTier)] || [];
    const timeSubdivChildTiers = tiers.filter(tier => 
      tiersToConstraints[elanReader.getTierName(tier)] === 'Time_Subdivision'
      && childTierNames.find(n => n === elanReader.getTierName(tier)) != null
    );
    for (const childTier of timeSubdivChildTiers) {
      const childTierName = elanReader.getTierName(childTier);
      // console.log(`adding time-subdiv child tier ${childTierName} to annotationChildren`);
      const childTierAnots = elanReader.getAnnotations(childTier);
      for (const parentAnot of elanReader.getAnnotations(parentTier)) {
        const sortedChildIDs = [];
        let prevSlot = elanReader.getAlignableAnnotationStartSlot(parentAnot);
        const endSlot = elanReader.getAlignableAnnotationEndSlot(parentAnot);
        while (prevSlot !== endSlot) {
          /* partial procedural rewrite of find code: 
          let cur;
          for (const childAnot of childAnots) {
            const childSlot = elanReader.getAlignableAnnotationStartSlot(childAnot);
            if (prevSlot === childSlot) {
              cur = childAnot;
              
            }
          }*/
          const cur = childTierAnots.find(a => 
            prevSlot === elanReader.getAlignableAnnotationStartSlot(a) || 
            (timeslots[prevSlot] != null && 
            timeslots[prevSlot] === elanReader.getAlignableAnnotationStartSlot(a)
            )
          );
          if (cur == null) {
            // this parent anot has no children on this tier
            break; // exit the while loop
          }
          const curID = elanReader.getAnnotationID(cur);
          sortedChildIDs.push(curID);
          prevSlot = elanReader.getAlignableAnnotationEndSlot(cur);
        }
        
        const parentAnotID = elanReader.getAnnotationID(parentAnot);
        if (sortedChildIDs.length !== 0) {
          if (annotationChildren[parentAnotID] == null) {
            annotationChildren[parentAnotID] = {}
          }
          annotationChildren[parentAnotID][childTierName] = sortedChildIDs;
        }
      }
    }
  }
  
  // add 'Included_In' children
  for (const parentTier of tiers) {
    const parentTierName = elanReader.getTierName(parentTier);
    const childTierNames = tierChildren[elanReader.getTierName(parentTier)] || [];
    const inclChildTiers = tiers.filter(tier => 
      tiersToConstraints[elanReader.getTierName(tier)] === 'Included_In'
      && childTierNames.find(n => n === elanReader.getTierName(tier)) != null
    );
    for (const childTier of inclChildTiers) {
      const childTierName = elanReader.getTierName(childTier);
      // console.log(`adding incl-in child tier ${childTierName} of ${parentTierName} to annotationChildren`);
      const childTierAnots = elanReader.getAnnotations(childTier);
      for (const parentAnot of elanReader.getAnnotations(parentTier)) {
        let childIDs = [];
        const parentStartSlot = elanReader.getAlignableAnnotationStartSlot(parentAnot);
        const parentEndSlot = elanReader.getAlignableAnnotationEndSlot(parentAnot);
        
        const parentStartMs = timeslots[parentStartSlot];
        const parentEndMs = timeslots[parentEndSlot];
        if (parentStartMs && parentEndMs) { // get children within these ms values
          // console.log(`within ms ${parentStartMs}, ${parentEndMs}?`);
          for (anot of childTierAnots) {
            const anotID = elanReader.getAnnotationID(anot);
            const startSlot = elanReader.getAlignableAnnotationStartSlot(anot);
            const endSlot = elanReader.getAlignableAnnotationEndSlot(anot);
            // console.log(`  checking child ${anotID}, slots ${startSlot}, ${endSlot}`);
            const startsWithin = (
              timeslots[startSlot] >= parentStartMs 
              && timeslots[startSlot] < parentEndMs
            );
            const endsWithin = (
              timeslots[endSlot] > parentStartMs 
              && timeslots[endSlot] <= parentEndMs
            );
            if (startsWithin || endsWithin) {
              // console.log('  added!');
              childIDs.push(anotID);
            }
          }
          
          // sort by ms value
          childIDs = childIDs.sort((id1,id2) => {
            // if start isn't defined, calculate it based on end, pretending duration is 1 ms
            const a1 = annotationsFromIDs[id1];
            const a2 = annotationsFromIDs[id2];
            const start1 = (
              timeslots[elanReader.getAlignableAnnotationStartSlot(a1)]
              || timeslots[elanReader.getAlignableAnnotationEndSlot(a1)] - 1
            );
            const start2 = (
              timeslots[elanReader.getAlignableAnnotationStartSlot(a2)] 
              || timeslots[elanReader.getAlignableAnnotationEndSlot(a2)] - 1
            );
            return start1 - start2;
          });
        }
        
        // check for children which share the parent's start or end slot
        for (anot of childTierAnots) {
          const anotID = elanReader.getAnnotationID(anot);
          const startSlot = elanReader.getAlignableAnnotationStartSlot(anot);
          const endSlot = elanReader.getAlignableAnnotationEndSlot(anot);
          if (startSlot === parentStartSlot && anotID !== childIDs[0]) {
            childIDs.splice(0, 0, anotID); // insert at beginning
          } else if (endSlot === parentEndSlot && anotID !== childIDs[childIDs.length - 1]) {
            childIDs.push(anotID);
          } 
        }
        
        // add children which share a boundary with an existing child
        // (but not if they end at the first child or start at the last child)
        let prevIndex = 0;
        while (prevIndex < childIDs.length - 1) {
          const prevID = childIDs[prevIndex];
          const prevAnot = annotationsFromIDs[prevID];
          const prevSlot = elanReader.getAlignableAnnotationEndSlot(prevAnot);
          
          const nextID = childIDs[prevIndex + 1];
          const nextAnot = annotationsFromIDs[nextID];
          const nextSlot = elanReader.getAlignableAnnotationStartSlot(nextAnot)
          
          let newAnot = childTierAnots.find(a => 
            elanReader.getAlignableAnnotationStartSlot(a) === prevSlot
          );
          if (newAnot == null) {
            newAnot = childTierAnots.find(a =>
              elanReader.getAlignableAnnotationEndSlot(a) === nextSlot
            );
          }
          if (newAnot != null) {
            const newID = elanReader.getAnnotationID(newAnot);
            if (newID != null && newID != nextID) {
              childIDs.splice(prevIndex + 1, 0, newID); // insert after prevIndex
            }
          }
          
          prevIndex++;
        }
        
        const parentAnotID = elanReader.getAnnotationID(parentAnot);
        if (!annotationChildren.hasOwnProperty(parentAnotID)) {
          annotationChildren[parentAnotID] = {};
        }
        annotationChildren[parentAnotID][childTierName] = childIDs;
      }
    }
  }
  
  const anotDescendants = {}; // indepAnotID -> depTierName -> ordered listof anotIDs descended from indepAnot
  for (const indepTier of indepTiers) {
    for (const indepAnot of elanReader.getAnnotations(indepTier)) {
      const indepAnotID = elanReader.getAnnotationID(indepAnot);
      const depTiersAnots = {}; // depTierName -> ordered listof anotIDs descended from indepAnot
      let pendingParentIDs = [indepAnotID];
      while (pendingParentIDs.length > 0) {
        const parentID = pendingParentIDs[0];
        pendingParentIDs.shift() // remove parentID from pendingParentIDs
        // add all of parentID's direct children to depTierAnots and to pendingParentIDs
        for (const depTierName in annotationChildren[parentID]) {
          if (annotationChildren[parentID].hasOwnProperty(depTierName)) {
            const childIDs = annotationChildren[parentID][depTierName];
            if (!depTiersAnots.hasOwnProperty(depTierName)) {
              depTiersAnots[depTierName] = [];
            }
            depTiersAnots[depTierName] = depTiersAnots[depTierName].concat(childIDs);
            pendingParentIDs = pendingParentIDs.concat(childIDs);
          }
        }
      }
      anotDescendants[indepAnotID] = depTiersAnots;
    }
  }
  
  const garbageTierNames = pfsxReader.getHiddenTiers(pfsxIn);
  const tierNameOrder = pfsxReader.getTierOrder(pfsxIn);
  
  for (let i = 0; i < indepTiers.length; i++) {
    const spkrID = "S" + (i + 1).toString(); // assume each independent tier has a distinct speaker
    const indepTierName = elanReader.getTierName(indepTiers[i]);
    
    jsonOut.metadata["speaker IDs"][spkrID] = {
      "name": elanReader.getTierSpeakerName(indepTiers[i]),
      "language": elanReader.getTierLanguage(indepTiers[i]),
      "tier": indepTierName,
    };
    
    for (const indepAnot of elanReader.getAnnotations(indepTiers[i])) {
      const indepAnotID = elanReader.getAnnotationID(indepAnot);
      const anotStartSlots = {};
      const anotEndSlots = {};
      assignSlots(indepAnotID, tiersToConstraints, annotationChildren, 
        annotationsFromIDs, timeslots, anotStartSlots, anotEndSlots
      );
      
      const sentenceJson = {
        "speaker": spkrID,
        "tier": indepTierName,
        "start_time_ms": parseInt(timeslots[elanReader.getAlignableAnnotationStartSlot(indepAnot)], 10),
        "end_time_ms": parseInt(timeslots[elanReader.getAlignableAnnotationEndSlot(indepAnot)], 10),
        "num_slots": anotEndSlots[indepAnotID],
        "text": elanReader.getAnnotationValue(indepAnot),
        "dependents": [],
      };
      
      const depTiersAnots = anotDescendants[indepAnotID];
      for (const depTierName in depTiersAnots) {
        if (depTiersAnots.hasOwnProperty(depTierName)) {
          const depTierJson = {
            "tier": depTierName,
            "values": [],
          };
          
          for (const depAnotID of depTiersAnots[depTierName]) {
            const depAnot = annotationsFromIDs[depAnotID];
            if (!anotStartSlots.hasOwnProperty(depAnotID)) {
              console.log(`oh no, missing annotation!`);
            }
            depTierJson.values.push({
              "start_slot": anotStartSlots[depAnotID],
              "end_slot": anotEndSlots[depAnotID],
              "value": elanReader.getAnnotationValue(depAnot),
            });
          }
          // depTierJson is already in order by start_slot, since anotDescendants is ordered
          sentenceJson.dependents.push(depTierJson); 
        }
      }
      
      if (tierNameOrder.length !== 0) {
        const orderedDependents = [];
        for (const tierName of tierNameOrder) {
          const tier = sentenceJson.dependents.find((t) => t.tier === tierName);
          if (tier != null) {
            orderedDependents.push(tier);
          }
        }
        sentenceJson["dependents"] = orderedDependents;
      }
      
      // remove hidden dependent tiers
      sentenceJson.dependents = sentenceJson.dependents.filter((t) => !garbageTierNames.includes(t.tier));
      // remove the independent tier if it's hidden
      if (garbageTierNames.includes(sentenceJson.tier)) {
        sentenceJson["text"] = "";
        sentenceJson["noTopRow"] = "true";
      }
      
      // sort by the numerical part of the tier ID to ensure consistent ordering; TODO delete this line
      // sentenceJson.dependents.sort((t1,t2) => parseInt(t1.tier.slice(1),10) - parseInt(t2.tier.slice(1),10));
          
      jsonOut.sentences.push(sentenceJson);
    }
  }
  jsonOut.sentences.sort((s1,s2) => s1.start_time_ms - s2.start_time_ms);
  
  for (const tier in jsonOut.metadata["tier IDs"]) {
    if (jsonOut.metadata["tier IDs"].hasOwnProperty(tier) && garbageTierNames.includes(tier)) {
      delete jsonOut.metadata["tier IDs"][tier];
    }
  }

  updateIndex(jsonOut.metadata, "data/index.json", storyID);
  
  const jsonPath = jsonFilesDir + storyID + ".json";
  fs.writeFileSync(jsonPath, JSON.stringify(jsonOut, null, 2));
  // console.log("✅  Correctly wrote " + storyID + ".json");
  callback();
}

// Updates the index and story files for each interlinear text, 
//   then executes the callback, passing the list of all story IDs that were processed
//   as an argument to the callback function. 
function preprocessDir(eafFilesDir, jsonFilesDir, callback) {
  const eafFileNames = fs.readdirSync(eafFilesDir).filter(f => 
    f[0] !== "." && f.slice(-4) !== 'pfsx'
  ); // excludes pfsx files (which are generated just by opening ELAN) and hidden files
  
  // use this to wait for all preprocess calls to terminate before executing the callback
  const status = {
    numJobs: eafFileNames.length,
    storyIDs: [],
  };
  if (eafFileNames.length === 0) {
    callback(status.storyIDs);
  }

  const whenDone = function () {
    status.numJobs--;
    if (status.numJobs <= 0) {
      callback(status.storyIDs);
    }
  };

  for (const eafFileName of eafFileNames) {
    console.log("Processing " + eafFileName);
    const eafPath = eafFilesDir + eafFileName;
    
    // parse .pfsx file, if found
    let pfsxJson = null;
    let pfsxPath = eafPath.slice(0, -4) + ".pfsx";
    fs.readFile(pfsxPath, function(err1, xmlData) {
      if (err1) {
        console.log(`WARN: Could not find .pfsx file for ${eafFileName}. Viewing preferences won't be used.`);
      } else {
        parseXml(xmlData, function (err2, jsonData) {
          if (err2) throw err2; 
          pfsxJson = jsonData;
        });
      }
    });
    
    fs.readFile(eafPath, function (err1, xmlData) {
      if (err1) throw err1;
      parseXml(xmlData, function (err2, jsonData) {
        if (err2) throw err2;
        const adoc = jsonData.ANNOTATION_DOCUMENT;
        status.storyIDs.push(elanReader.getDocID(adoc));
        preprocess(adoc, pfsxJson, jsonFilesDir, eafFileName, whenDone);
      });
    });
  }
}

module.exports = {
  preprocessDir: preprocessDir,
  preprocess: preprocess,
};
