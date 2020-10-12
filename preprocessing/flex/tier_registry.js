var getTierName = require('./flex_tier_names.js').getTierName;

class tierRegistry {

  constructor() {
    this.jsonTierIDs = {}; // format that should be written to file
  }

  getTiersJson() {
    return this.jsonTierIDs;
  }

  // if this is a new, non-ignored tier, include it in metadata
  // if the tier is ignored, return null; else return its name
  maybeRegisterTier(lang, type, isSubdivided) {
    const tierName = getTierName(lang, type)
    if (tierName != null) {
      this.jsonTierIDs[tierName] = {
        subdivided: isSubdivided,
      };
    }
    return tierName;
  }
}

module.exports = {
  tierRegistry: tierRegistry
};
