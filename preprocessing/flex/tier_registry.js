// This class exists to keep track of what all the tier names are
// and which tiers are subdivided. 

// Why? Because new tiers can be discovered from multiple functions in flex_to_json.js.
// Without using this tierRegistry class, discovering a new tier would look like: 
// tiersJson[tierName] = { subdivided: true };
// That's fine and perhaps clearer, but it invites bugs. I previously wrote "subdivided"
// in one place and "isSubdivided" in another, and didn't notice the problem for a while.

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
