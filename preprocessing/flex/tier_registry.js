class tierRegistry {

  constructor() {
    this.jsonTierIDs = {}; // format that should be written to file
  }

  getTiersJson() {
    return this.jsonTierIDs;
  }

  // if this is a new, non-ignored tier, include it in metadata
  maybeRegisterTier(tierName, isSubdivided) {
    if (tierName != null) {
      this.jsonTierIDs[tierName] = {
        subdivided: isSubdivided,
      };
    }
  }
}

module.exports = {
  tierRegistry: tierRegistry
};
