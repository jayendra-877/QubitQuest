const attempts = [];

const ChallengeAttempt = {
  create: (attempt) => {
    const newAttempt = { id: Date.now().toString(), ...attempt, attemptedAt: new Date() };
    attempts.push(newAttempt);
    return newAttempt;
  },
  findByUser: (userId) => {
    return attempts.filter(a => a.userId === userId);
  },
  findByUserAndChallenge: (userId, challengeId) => {
    return attempts.find(a => a.userId === userId && a.challengeId === challengeId && a.success === true);
  }
};

module.exports = ChallengeAttempt;
