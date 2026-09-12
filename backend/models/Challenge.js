const challenges = [];

const Challenge = {
  seed: (seedData) => {
    challenges.push(...seedData);
  },
  findAll: () => {
    return challenges;
  },
  findById: (id) => {
    return challenges.find((c) => c.id === id);
  }
};

module.exports = Challenge;
