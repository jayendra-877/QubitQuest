const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Challenge = require('../models/Challenge');
const ChallengeAttempt = require('../models/ChallengeAttempt');

// Seed Data
Challenge.seed([
  {
    id: 'c1',
    level: 1,
    theme: 'The Grasslands',
    title: 'Predict the Bit Flip',
    description: 'If a qubit starts at |0> and we apply an X gate, what is the resulting state?',
    difficulty: 'Beginner',
    type: 'predict',
    initial_circuit: [{ type: 'X', qubit: 0, step: 0 }],
    expected_output: '1' // The user types '1'
  },
  {
    id: 'c2',
    level: 1,
    theme: 'The Grasslands',
    title: 'Build a NOT Gate',
    description: 'Construct a circuit that flips a |0> qubit to a |1>. Drag the correct gate to the wire.',
    difficulty: 'Beginner',
    type: 'build',
    initial_circuit: [],
    expected_circuit: [{ type: 'X', qubit: 0, step: 0 }]
  },
  {
    id: 'c3',
    level: 2,
    theme: 'The Volcanic Crags',
    title: 'Predict Superposition',
    description: 'Applying an H gate to |0> creates a state where measuring 0 or 1 is equally likely. What is this state commonly called?',
    difficulty: 'Intermediate',
    type: 'predict',
    initial_circuit: [{ type: 'H', qubit: 0, step: 0 }],
    expected_output: 'superposition'
  },
  {
    id: 'c4',
    level: 2,
    theme: 'The Volcanic Crags',
    title: 'Fix the Entanglement',
    description: 'This circuit is supposed to create a Bell State (Entanglement), but the gates are in the wrong order. Fix it!',
    difficulty: 'Intermediate',
    type: 'debug',
    initial_circuit: [
      { type: 'CNOT', qubit: 0, target: 1, step: 0 },
      { type: 'H', qubit: 0, step: 1 }
    ],
    expected_circuit: [
      { type: 'H', qubit: 0, step: 0 },
      { type: 'CNOT', qubit: 0, target: 1, step: 1 }
    ]
  }
]);

// Optional Auth Middleware for GET /api/challenges
const optionalAuth = (req, res, next) => {
  const jwt = require('jsonwebtoken');
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      req.user = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key');
    } catch (err) {}
  }
  next();
};

// GET /api/challenges - Return all challenges grouped by level
router.get('/', optionalAuth, (req, res) => {
  const allChallenges = Challenge.findAll();
  
  let userAttempts = [];
  if (req.user) {
    userAttempts = ChallengeAttempt.findByUser(req.user.id);
  }
  
  // Attach completed status
  const challengesWithStatus = allChallenges.map(c => {
    const isCompleted = userAttempts.some(a => a.challengeId === c.id && a.success === true);
    return {
      id: c.id,
      level: c.level,
      theme: c.theme,
      title: c.title,
      type: c.type,
      difficulty: c.difficulty,
      completed: isCompleted
    };
  });

  res.json(challengesWithStatus);
});

// GET /api/challenges/:id - Get full challenge details
router.get('/:id', authMiddleware, (req, res) => {
  const challenge = Challenge.findById(req.params.id);
  if (!challenge) {
    return res.status(404).json({ message: 'Challenge not found' });
  }

  // Remove the expected answers from the payload sent to the client!
  const { expected_output, expected_circuit, ...safeChallenge } = challenge;
  res.json(safeChallenge);
});

// POST /api/challenges/:id/submit - Submit an attempt
router.post('/:id/submit', authMiddleware, (req, res) => {
  const challenge = Challenge.findById(req.params.id);
  if (!challenge) {
    return res.status(404).json({ message: 'Challenge not found' });
  }

  let isSuccess = false;

  if (challenge.type === 'predict') {
    const { prediction } = req.body;
    if (prediction && prediction.toLowerCase() === challenge.expected_output.toLowerCase()) {
      isSuccess = true;
    }
  } else if (challenge.type === 'build' || challenge.type === 'debug') {
    const { circuit } = req.body;
    
    // Sort logic to make array comparison reliable
    const sortCircuit = (a, b) => {
      if (a.step !== b.step) return a.step - b.step;
      return a.qubit - b.qubit;
    };
    
    const submittedSorted = [...(circuit || [])].sort(sortCircuit);
    const expectedSorted = [...challenge.expected_circuit].sort(sortCircuit);

    isSuccess = JSON.stringify(submittedSorted) === JSON.stringify(expectedSorted);
  }

  // Record the attempt
  ChallengeAttempt.create({
    userId: req.user.id,
    challengeId: challenge.id,
    submitted_circuit: req.body.circuit || null,
    success: isSuccess
  });

  if (isSuccess) {
    res.json({ success: true, message: 'Correct! Castle destroyed.' });
  } else {
    res.status(400).json({ success: false, message: 'Incorrect. Try again.' });
  }
});

module.exports = router;
