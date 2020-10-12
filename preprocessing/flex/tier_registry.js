class tierRegistry {

  constructor() {
    this.tierIDs = {}; // format that should be written to file
  }

  getTiersJson() {
    return this.tierIDs;
  }

  // if this is a new tier, include it in metadata
  registerTier(tierName, isSubdivided) {
    this.tierIDs[tierName] = {
      subdivided: isSubdivided,
    };
  }
}

module.exports = {
  tierRegistry: tierRegistry
};
