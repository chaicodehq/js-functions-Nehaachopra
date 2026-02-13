/**
 * 🗳️ Panchayat Election System - Capstone
 *
 * Village ki panchayat election ka system bana! Yeh CAPSTONE challenge hai
 * jisme saare function concepts ek saath use honge:
 * closures, callbacks, HOF, factory, recursion, pure functions.
 *
 * Functions:
 *
 *   1. createElection(candidates)
 *      - CLOSURE: private state (votes object, registered voters set)
 *      - candidates: array of { id, name, party }
 *      - Returns object with methods:
 *
 *      registerVoter(voter)
 *        - voter: { id, name, age }
 *        - Add to private registered set. Return true.
 *        - Agar already registered or voter invalid, return false.
 *        - Agar age < 18, return false.
 *
 *      castVote(voterId, candidateId, onSuccess, onError)
 *        - CALLBACKS: call onSuccess or onError based on result
 *        - Validate: voter registered? candidate exists? already voted?
 *        - If valid: record vote, call onSuccess({ voterId, candidateId })
 *        - If invalid: call onError("reason string")
 *        - Return the callback's return value
 *
 *      getResults(sortFn)
 *        - HOF: takes optional sort comparator function
 *        - Returns array of { id, name, party, votes: count }
 *        - If sortFn provided, sort results using it
 *        - Default (no sortFn): sort by votes descending
 *
 *      getWinner()
 *        - Returns candidate object with most votes
 *        - If tie, return first candidate among tied ones
 *        - If no votes cast, return null
 *
 *   2. createVoteValidator(rules)
 *      - FACTORY: returns a validation function
 *      - rules: { minAge: 18, requiredFields: ["id", "name", "age"] }
 *      - Returned function takes a voter object and returns { valid, reason }
 *
 *   3. countVotesInRegions(regionTree)
 *      - RECURSION: count total votes in nested region structure
 *      - regionTree: { name, votes: number, subRegions: [...] }
 *      - Sum votes from this region + all subRegions (recursively)
 *      - Agar regionTree null/invalid, return 0
 *
 *   4. tallyPure(currentTally, candidateId)
 *      - PURE FUNCTION: returns NEW tally object with incremented count
 *      - currentTally: { "cand1": 5, "cand2": 3, ... }
 *      - Return new object where candidateId count is incremented by 1
 *      - MUST NOT modify currentTally
 *      - If candidateId not in tally, add it with count 1
 *
 * @example
 *   const election = createElection([
 *     { id: "C1", name: "Sarpanch Ram", party: "Janata" },
 *     { id: "C2", name: "Pradhan Sita", party: "Lok" }
 *   ]);
 *   election.registerVoter({ id: "V1", name: "Mohan", age: 25 });
 *   election.castVote("V1", "C1", r => "voted!", e => "error: " + e);
 *   // => "voted!"
 */
export function createElection(candidates) {
  // Your code here
  if (!Array.isArray(candidates)) return (x) => {return x}

  candidates.forEach(candidate => candidate.votes = 0)
  let registeredVoters = [];

  return {
    registerVoter: (voter) => {
      if (!voter || typeof voter !== "object") return false
      const id = voter.id;
      const name = voter.name;
      const age = voter.age;
      if (typeof id !== "string" || id === "" || typeof name !== "string" || name === "" || !Number.isInteger(age) || age < 18 || age > 122) return false

      if (!registeredVoters.find(voterDetail => voterDetail.id === id)) {
        registeredVoters.push({id, name, age, voted: false});
        return true
      }
      return false;
    },

    castVote: (voterId, candidateId, onSuccess, onError) => {
      if (typeof voterId !== "string" || voterId === "") return onError("Invalid Voter ID")
      if (typeof candidateId !== "string" || candidateId === "") return onError("Invalid Candidate ID");
      const voterDetail = registeredVoters.find(voter => voter.id === voterId);
      if (!voterDetail) return onError("Voter ID not registered!");
      if (voterDetail.voted) return onError("Voter has already voted!")
      const candidateDetail = candidates.find(candidate => candidate.id === candidateId);
      if (!candidateDetail) return onError("Candidate ID not registered!");
      voterDetail.voted = true;
      candidateDetail.votes = (candidateDetail.votes ?? 0) + 1;
      return onSuccess({voterId, candidateId})
    },
    getResults: (sortFn=null) => {
      if (typeof sortFn === "function") {
        return [...candidates].sort(sortFn)
      }
      return [...candidates].sort((a,b) => (b.votes ?? 0) - (a.votes ?? 0))
    },
    getWinner: () => {
      if (!candidates.length) return null;
      const sorted = [...candidates].sort((a,b) => b.votes - a.votes);
      if (sorted.length > 0 && sorted[0].votes > 0) return sorted[0]
      return null
    }
  }
}

export function createVoteValidator(rules) {
  // Your code here
  if (!rules || typeof rules !== "object") {
    return () => ({ valid: false, reason: "Invalid rules" });
  }
  const { minAge = 18, requiredFields = [] } = rules;
  return (voter) => {
    if (!voter || typeof voter !== "object") return{valid: false, reason: "Invalid voter object"}
    
    for (let field of requiredFields) {
      if (!(field in voter)) {
        return { valid: false, reason: `Missing field: ${field}` };
      }
    }

    if (typeof voter.age !== "number" || voter.age < minAge) {
      return { valid: false, reason: `Age must be at least ${minAge}` };
    }

    return { valid: true, reason: "Voter is eligible" };
  };
}
export function countVotesInRegions(regionTree) {
  // Your code here. Most beautiful piece of code
  if (!regionTree || typeof regionTree !== "object") return 0

  const countSubRegionVotes = (regionArray) => {
    if (regionArray.length === 0) return 0;

    const [first, ...rest] = regionArray;

    return (
      countVotesInRegions(first) +
      countSubRegionVotes(rest)
    );
  };

  return ((regionTree.votes || 0) + countSubRegionVotes(regionTree.subRegions));
}

export function tallyPure(currentTally, candidateId) {
  // Your code here
  if (!currentTally || typeof currentTally !== "object" || typeof candidateId !== "string" || candidateId === "") return {}
  const outputObj = {...currentTally};
  outputObj[candidateId] =  (outputObj[candidateId] ?? 0) + 1;
  return outputObj;
}
const cdts = createElection([{"id": 'C001', "name": "neha", "party": "party1"}, {"id": 'C002', "name": "roi", "party": "party2"}])
console.log(cdts.getResults())