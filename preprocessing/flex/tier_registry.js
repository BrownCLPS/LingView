class tierRegistry {

  constructor() {
    this.jsonTierIDs = {}; // format that should be written to file
  }

  getTiersJson() {
    return this.jsonTierIDs;
  }

  // if this is a new tier, include it in metadata
  registerTier(tierName, isSubdivided) {
    this.jsonTierIDs[tierName] = {
      subdivided: isSubdivided,
    };
  }
}

module.exports = {
  tierRegistry: tierRegistry
};
