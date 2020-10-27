class tierRegistry {

  constructor() {
    this.tierIDs = {}; // format that should be written to file
  }

  getTiersJson() {
    return this.tierIDs;
  }

  // include this tier in the metadata
  registerTier(tierName, isSubdivided) {
    this.tierIDs[tierName] = {
      subdivided: isSubdivided,
    };
  }
}

module.exports = {
  tierRegistry: tierRegistry
};
