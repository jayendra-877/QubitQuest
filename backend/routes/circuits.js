const express = require('express');
const router = express.Router();

router.post('/execute', (req, res) => {
  res.json({
    status: 'success',
    results: {
      '00': 0.5,
      '11': 0.5
    }
  });
});

router.post('/save', (req, res) => {
  res.json({
    message: 'Circuit saved successfully',
    circuitId: 'sc1'
  });
});

router.get('/saved', (req, res) => {
  res.json([
    { id: 'sc1', name: 'My First Bell State', circuit_data: [] }
  ]);
});

module.exports = router;
