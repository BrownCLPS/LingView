/* 
Functions for processing flex files into the json format used by the site.
*/

const fs = require('fs');
const util = require('util');
const parseXml = require('xml2js').parseString;
const speakerRegistry = require('../speaker_registry').speakerRegistry;
const tierRegistry = require('./tier_registry').tierRegistry;
const mediaFinder = require('../find_media');
const flexReader = require('./read_flex');
const getTierName = require('./flex_tier_names.js').getTierName;

// punct - a string
// return a boolean indicating whether 'punct' should typically appear 
//   preceded by a space, but not followed by a space, in text
function isStartPunctuation(punct) {
  return (punct === "¿") || (punct === "(");
}

// char - a string
// return true if 'char' is used by FLEx as a morpheme separator
function isSeparator(char) {
  return (char === "-") || (char === "=") || (char === "~");
}

// word - the data associated with a single word of the source text, 
//   structured as in FLEx
// return true if the word is tagged as punctuation within FLEx
// If the word is marked as type "punct" but the word is alphanumeric,
// this word might come from a different language than what FLEx is trying 
// to detect in this file, so this word should not be marked as a punctuation. 
function isPunctuation(word) {
  if (flexReader.getWordType(word) === "punct") {
    const wordValue = flexReader.getWordValue(word);
    // The Regex checks if the word contains any alphanumeric characters, 
    // including special alphabetic characters such as accented letters. 
    return wordValue == null || !wordValue.match(/^[0-9a-zA-ZÀ-ÿ]+$/);
  }
  return false; 
}

function isIgnored(tierType) {
  // Omit these tier types from the website, because they're ugly and mostly useless.
  // See flex_tier_names.js for an explanation of these types
  return (
      tierType === "variantTypes" ||
      tierType === "hn" ||
      tierType === "glsAppend" ||
      tierType === "msa"
  );
}

// metadata - a metadata object
// indexFilePath - a string, the address of the index in the filesystem
// storyID - a string, the unique identifier used for the current interlinear text within the index
// writes the metadata to the index, overwriting any preexisting metadata for this storyID
function updateIndex(metadata, indexFilePath, storyID) {
  let index = JSON.parse(fs.readFileSync(indexFilePath, "utf8"));
  index[storyID] = metadata;
  fs.writeFileSync(indexFilePath, JSON.stringify(index, null, 2));
}

// morphsThisTier - a list of morph tokens, 
//   where each morph token is an object structured as in FLEx
// wordStartSlot - the timeslot index of the first morph token within its sentence
// wordEndSlot - the timeslot index after the last morph token within its sentence
function concatMorphs(morphsThisTier, wordStartSlot, wordEndSlot) {
  let wordMorphsText = '';
  let maybeAddCompoundSeparator = false; // never add a separator before the first word
  for (let i = wordStartSlot; i < wordEndSlot; i++) {
    let nextValue = '***';
    if (morphsThisTier[i] != null && morphsThisTier[i]['value'] != null) {
      nextValue = morphsThisTier[i]["value"];

      // insert missing '-' if needed (FLEX seems to omit them in glosses of affixes)
      if (morphsThisTier[i]["tier type"] === 'gls') {
        if (morphsThisTier[i]["part of speech"] === 'prefix') {
          nextValue = nextValue + '-';
        } else if (morphsThisTier[i]["part of speech"] === 'suffix') {
          nextValue = '-' + nextValue;
        }
      }
    }

    // insert compound-word separator if needed
    if (maybeAddCompoundSeparator && !isSeparator(nextValue.substring(0, 1))) {
      wordMorphsText += '+';
    }
    if (!isSeparator(nextValue.substring(-1))) {
      maybeAddCompoundSeparator = true;
    }

    wordMorphsText += nextValue;
  }

  return wordMorphsText;
}

// word - the data associated with a single word of the source text, 
//   structured as in FLEx
// returns an object indicating how to represent this word within the 
//   concatenated sentence text
function getSentenceToken(word) {
  const wordValue = flexReader.getWordValue(word);

  let type = 'txt';
  if (isPunctuation(word)) {
    if (isStartPunctuation(wordValue)) {
      type = 'start';
    } else {
      type = 'end';
    }
  }

  return {'value': wordValue, 'type': type};
}

// sentenceTokens - a list of objects, each indicating how to represent
//   one word within the sentence text
// returns the sentence as a string with correct punctuation and spacing
function concatWords(sentenceTokens) {
  let sentenceText = "";
  let maybeAddSpace = false; // no space before first word
  for (const typedToken of sentenceTokens) {
    if (maybeAddSpace && (typedToken.type !== "end")) {
      sentenceText += " ";
    }
    maybeAddSpace = (typedToken.type !== "start");
    // If the word token's value is undefined, skip this word.
    sentenceText += typedToken["value"] || "";
  }
  return sentenceText;
}

// morphsJson - an object describing the morph tokens in a sentence
// returns an object describing all dependent tiers of the sentence, 
//   formatted for use by the website
function getDependentsJson(morphsJson) {
  const dependentsJson = [];
  for (const tierName in morphsJson) {
    if (morphsJson.hasOwnProperty(tierName)) {
      const valuesJson = [];
      for (const start_slot in morphsJson[tierName]) {
        if (morphsJson[tierName].hasOwnProperty(start_slot)) {
          valuesJson.push({
            "start_slot": parseInt(start_slot, 10),
            "end_slot": morphsJson[tierName][start_slot]["end_slot"],
            "value": morphsJson[tierName][start_slot]["value"]
          })
        }
      }
      dependentsJson.push({
        "tier": tierName,
        "values": valuesJson
      });
    }
  }
  return dependentsJson;
}

// FLEx structures morph information by morpheme, so that for example,
//   the citation form is clearly associated with all other info about the same
//   morpheme, but not clearly associated with the citation forms of other morphs.
// This function repackages the information by type to make it useful for the website.
// morphs - a list of objects describing each morpheme in a part of the source text,
//   structured according to FLEx's data format
// tierReg - a tierRegistry object 
// startSlot - the timeslot index of the first morpheme within its sentence
// returns an object describing the morphemes, in which descriptors have been
//   categorized into "tiers" by information type (e.g. citation form or gloss)
function repackageMorphs(morphs, tierReg, startSlot) {
  // FLEx packages morph items by morpheme, not by type.
  // We handle this by first re-packaging all the morphs by type(a.k.a. tier),
  // then concatenating all the morphs of the same type.

  // Repackaging step:
  const morphTokens = {};
  let slotNum = startSlot;
  for (const morph of morphs) {
    for (const tier of flexReader.getTiers(morph)) {
      const tierType = flexReader.getTierType(tier);
      if (!isIgnored(tierType)) {
        const tierName = getTierName(flexReader.getTierLang(tier), tierType);
        tierReg.registerTier(tierName, true);
        if (tierName != null) {
          if (!morphTokens.hasOwnProperty(tierName)) {
            morphTokens[tierName] = {};
          }
          morphTokens[tierName][slotNum] = {
            "value": flexReader.getTierValue(tier),
            "tier type": flexReader.getTierType(tier),
            "part of speech": flexReader.getMorphPartOfSpeech(morph),
          };
        }
      }
    }
    slotNum++;
  }

  // Concatenating step:
  let morphsJson = {};
  for (const tierName in morphTokens) {
    if (morphTokens.hasOwnProperty(tierName)) {
      if (!morphsJson.hasOwnProperty(tierName)) {
        morphsJson[tierName] = {};
      }
      morphsJson[tierName][startSlot] = {
        "value": concatMorphs(morphTokens[tierName], startSlot, slotNum),
        "end_slot": slotNum
      };
    }
  }

  return morphsJson;
}

// dest - an object with all its values nested two layers deep
// src - an object with all its values nested two layers deep
// inserts all values of src into dest, preserving their inner and outer keys,
//   while retaining all values of dest except those that directly conflict with src
function mergeTwoLayerDict(dest, src) {
  for (const outerProp in src) {
    if (src.hasOwnProperty(outerProp)) {
      if (!dest.hasOwnProperty(outerProp)) {
        dest[outerProp] = {};
      }
      for (const innerProp in src[outerProp]) {
        if (src[outerProp].hasOwnProperty(innerProp)) {
          dest[outerProp][innerProp] = src[outerProp][innerProp]; // overwrites dest[outerProp][innerProp]
        }
      }
    }
  }
}

// freeGlosses - a list of objects describing the free glosses for a sentence,
//   structured as in the FLEx file
// tierReg - a tierRegistry object
// endSlot - the timeslot index of the end of the sentence
// returns an object associating each free gloss with its tier
function repackageFreeGlosses(freeGlosses, tierReg, endSlot) {
  const glossStartSlot = 0;
  const morphsJson = {};
  for (const gloss of freeGlosses) {
    const tierName = getTierName(flexReader.getFreeGlossLang(gloss), "free");
    tierReg.registerTier(tierName, false);
    if (tierName != null) {
      if (!morphsJson.hasOwnProperty(tierName)) {
        morphsJson[tierName] = {};
      }
      morphsJson[tierName][glossStartSlot] = {
        "value": flexReader.getFreeGlossValue(gloss),
        "end_slot": endSlot
      };
    }
  }
  return morphsJson;
}

// sentence - an object describing a sentence of source text,
//   structured as in the FLEx file
// speakerReg - a map from speaker names to speaker IDs, which we'll add to if we find a new speaker
// tierReg - a tierRegistry object
// wordsTierID - the ID which has been assigned to the words tier
// hasTimestamps - whether the FLEx file contains a start and end value for each sentence
// returns an object describing the sentence, 
//   structured correctly for use by the website
function getSentenceJson(sentence, speakerReg, tierReg, wordsTierID, hasTimestamps) {
  const morphsJson = {}; // tierName -> start_slot -> {"value": value, "end_slot": end_slot}
  morphsJson[wordsTierID] = {}; // FIXME words tier will show up even when the sentence is empty of words

  let slotNum = 0;
  const sentenceTokens = []; // for building the free transcription
  for (const word of flexReader.getSentenceWords(sentence)) {
    const wordStartSlot = slotNum;

    // deal with the morphs that subdivide this word
    const morphs = flexReader.getWordMorphs(word);
    const newMorphsJson = repackageMorphs(morphs, tierReg, slotNum);
    mergeTwoLayerDict(morphsJson, newMorphsJson);
    slotNum += morphs.length;
    if (morphs.length === 0 && !isPunctuation(word)) {
      slotNum++; // if a non-punctuation word has no morphs, it still takes up a slot
    }

    // deal with the word itself
    if (!isPunctuation(word)) {
      // count this as a separate word on the words tier
      morphsJson[wordsTierID][wordStartSlot] = {
        "value": flexReader.getWordValue(word),
        "end_slot": slotNum
      };
    }

    // deal with sentence-level transcription
    sentenceTokens.push(getSentenceToken(word));
  }

  // deal with free glosses
  const freeGlosses = flexReader.getSentenceFreeGlosses(sentence);
  const freeGlossesJson = repackageFreeGlosses(freeGlosses, tierReg, slotNum);
  mergeTwoLayerDict(morphsJson, freeGlossesJson);
  let sentenceText = flexReader.getSentenceTextIfNoWords(sentence);
  if (sentenceText == null) {
    sentenceText = concatWords(sentenceTokens)
  }

  let sentenceJson = {
    "num_slots": slotNum,
    "text": sentenceText,
    "dependents": getDependentsJson(morphsJson),
  };
  
  if (hasTimestamps) {
    sentenceJson.start_time_ms = flexReader.getSentenceStartTime(sentence);
    sentenceJson.end_time_ms = flexReader.getSentenceEndTime(sentence);
  }
  
  let speaker = flexReader.getSentenceSpeaker(sentence);
  if (speaker != null) {
    speakerReg.maybeRegisterSpeaker(speaker);
    sentenceJson.speaker = speakerReg.getSpeakerID(speaker);
  }
  
  return sentenceJson;
}

// jsonIn - the JSON parse of the FLEx interlinear-text
// jsonFilesDir - the directory for the output file describing this interlinear text
// fileName - the path to the FLEx file
// callback - the function that will execute when the preprocessText function completes
// updates the index and story files for this interlinear text, 
//   then executes the callback
function preprocessText(jsonIn, jsonFilesDir, fileName, callback) {
  let storyID = flexReader.getDocumentID(jsonIn);
  
  let metadata = mediaFinder.improveFLExIndexData(fileName, storyID, jsonIn);
  const speakerReg = new speakerRegistry();
  metadata['speakers'] = speakerReg.getSpeakersList();

  const jsonOut = {
    "metadata": metadata,
    "sentences": []
  };

  let textLang = flexReader.getDocumentSourceLang(jsonIn);
  const tierReg = new tierRegistry();
  const wordsTierName = getTierName(textLang, "words");
  tierReg.registerTier(wordsTierName, true);

  const hasTimestamps = flexReader.documentHasTimestamps(jsonIn);
  
  for (const paragraph of flexReader.getDocumentParagraphs(jsonIn)) {
    for (const sentence of flexReader.getParagraphSentences(paragraph)) {
      jsonOut.sentences.push(getSentenceJson(sentence, speakerReg, tierReg, wordsTierName, hasTimestamps));
    }
  }

  jsonOut.metadata['tier IDs'] = tierReg.getTiersJson();

  updateIndex(jsonOut.metadata, "data/index.json", storyID);

  jsonOut.metadata['speaker IDs'] = speakerReg.getSpeakersJson();

  const prettyString = JSON.stringify(jsonOut, null, 2);
  const jsonPath = jsonFilesDir + storyID + ".json";
  fs.writeFile(jsonPath, prettyString, function (err) {
    if (err) {
      console.log(err);
    } else {
      // console.log("✅  Correctly wrote " + storyID + ".json");
      if (callback != null) {
        callback();
      }
    }
  });
}

// xmlFilesDir - a directory containing zero or more FLEx files
// jsonFilesDir - a directory for output files describing individual interlinear texts
// callback - the function that will execute when the preprocess_dir function completes.
//   The callback function should take a list of story IDs as argument. 
// Updates the index and story files for each interlinear text, 
//   then executes the callback, passing the list of all story IDs that were processed
//   as an argument to the callback function. 
function preprocessDir(xmlFilesDir, jsonFilesDir, callback) {
  const xmlFileNames = fs.readdirSync(xmlFilesDir).filter(f => f[0] !== '.'); // excludes hidden files

  // use this to wait for all preprocess calls to terminate before executing the callback
  const status = {
    numJobs: xmlFileNames.length,
    storyIDs: [],
  };
  if (xmlFileNames.length === 0) {
    callback(status.storyIDs);
  }

  const whenDone = function () {
    status.numJobs--;
    if (status.numJobs <= 0) {
      callback(status.storyIDs);
    }
  };

  for (const xmlFileName of xmlFileNames) {
    console.log("Processing " + xmlFileName);
    const xmlPath = xmlFilesDir + xmlFileName;
    fs.readFile(xmlPath, function (err1, xmlData) {
      if (err1) throw err1;
      parseXml(xmlData, function (err2, jsonData) {
        if (err2) throw err2;
        
        const texts = jsonData['document']['interlinear-text'];
        
        // wait for all preprocessText calls to terminate before executing whenDone
        const singleFileStatus = {numJobs: texts.length};
        const singleTextCallback = function () {
          singleFileStatus.numJobs--;
          if (singleFileStatus.numJobs <= 0) {
            whenDone();
          }
        };
        
        for (const text of texts) {
          status.storyIDs.push(flexReader.getDocumentID(text));
          preprocessText(text, jsonFilesDir, xmlFileName, singleTextCallback);
        }
      });
    });
  }
}

module.exports = {
  preprocessDir: preprocessDir
};
