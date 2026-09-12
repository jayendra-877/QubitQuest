const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key';

// SIGNUP
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Please provide all fields' });
    }

    const existingUser = User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = User.create({ username, email, passwordHash });

    const token = jwt.sign({ id: newUser.id }, JWT_SECRET, { expiresIn: '1d' });

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: { id: newUser.id, username: newUser.username, email: newUser.email }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during signup' });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = User.findByEmail(email);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1d' });

    res.json({
      message: 'Logged in successfully',
      token,
      user: { id: user.id, username: user.username, email: user.email }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// GET CURRENT USER (Protected)
router.get('/me', authMiddleware, (req, res) => {
  try {
    const user = User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Return user without passwordHash
    res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: `https://i.pravatar.cc/150?u=${user.id}`
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching user' });
  }
});

// LOGOUT (Client handles destroying token, this is just a dummy response)
router.post('/logout', (req, res) => {
  res.json({ message: 'Logout successful' });
});

module.exports = router;
