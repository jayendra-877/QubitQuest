const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

const SEED_TOPICS = [
  {
    id: 't3',
    title: 'Quantum Entanglement',
    order_number: 3,
    content: `
# Quantum Entanglement

Entanglement is a physical phenomenon that occurs when a group of particles are generated, interact, or share spatial proximity in a way such that the quantum state of each particle of the group cannot be described independently of the state of the others.

## Spooky Action at a Distance

Einstein famously called it "spooky action at a distance". If you measure one entangled particle, you instantly know the state of the other, no matter how far apart they are!

### Key Concepts
- **Non-locality**: Information seems to travel faster than light (though it can't be used to communicate).
- **Bell states**: The specific maximally entangled quantum states of two qubits.
    `
  },
  {
    id: 't1',
    title: 'Introduction to Qubits',
    order_number: 1,
    content: `
# Introduction to Qubits

A **qubit** (or quantum bit) is the basic unit of quantum information.

Unlike a classical bit, which can be either \`0\` or \`1\`, a qubit can exist in a state of \`0\`, \`1\`, or a combination of both!

## Properties of a Qubit
1. **Superposition**: Existing in multiple states at once.
2. **Entanglement**: Linking states with other qubits.
3. **Interference**: Qubit probabilities can cancel each other out or amplify.

> "If you think you understand quantum mechanics, you don't understand quantum mechanics." - Richard Feynman
    `
  },
  {
    id: 't4',
    title: 'Quantum Gates',
    order_number: 4,
    content: `
# Quantum Gates

Just as classical computers have logic gates (AND, OR, NOT), quantum computers have **quantum gates**.

## Common Gates
- **X Gate**: The quantum equivalent of the NOT gate. It flips a \`0\` to a \`1\` and vice versa.
- **H Gate (Hadamard)**: Puts a qubit into a state of *superposition*.
- **CX Gate (CNOT)**: A two-qubit gate that entangles them.

Here is some pseudo-code:
\`\`\`python
# Apply an X gate to qubit 0
circuit.x(0)
\`\`\`
    `
  },
  {
    id: 't2',
    title: 'Superposition',
    order_number: 2,
    content: `
# Superposition

Superposition is the ability of a quantum system to be in multiple states at the same time until it is measured.

## Schrodinger's Cat
The famous thought experiment where a cat is simultaneously alive and dead until you open the box to check. This illustrates how macroscopic systems differ from microscopic quantum states.
    `
  }
];

// GET /api/topics - Returns list of topics (unordered to test frontend sorting)
router.get('/', authMiddleware, (req, res) => {
  const summary = SEED_TOPICS.map(({ id, title, order_number }) => ({
    id,
    title,
    order_number
  }));
  res.json(summary);
});

// GET /api/topics/:id - Returns full topic content
router.get('/:id', authMiddleware, (req, res) => {
  const topic = SEED_TOPICS.find(t => t.id === req.params.id);
  
  if (!topic) {
    return res.status(404).json({ message: 'Topic not found' });
  }

  res.json(topic);
});

module.exports = router;
