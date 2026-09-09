const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const topicsRoutes = require('./routes/topics');
const challengesRoutes = require('./routes/challenges');
const circuitsRoutes = require('./routes/circuits');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Stub API Routes
app.use('/api/auth', authRoutes);
app.use('/api/topics', topicsRoutes);
app.use('/api/challenges', challengesRoutes);
app.use('/api/circuits', circuitsRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend skeleton is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
