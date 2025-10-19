const express = require('express');
const bcrypt = require('bcryptjs');
const { createUser, findUserByEmail } = require('../models/database');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await createUser(email, password, name);
    res.status(201).json({ message: 'User registered successfully', user: { id: user.id, email: user.email, name: user.name } });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await findUserByEmail(email);
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    req.session.userId = user.id;
    req.session.userEmail = user.email;
    
    res.json({ 
      message: 'Login successful', 
      user: { id: user.id, email: user.email, name: user.name }
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

// Logout
router.post('/logout', (req, res) => {
  req.session.destroy();
  res.json({ message: 'Logged out successfully' });
});

// Check auth status
router.get('/me', async (req, res) => {
  if (req.session.userId) {
    try {
      const user = await findUserByEmail(req.session.userEmail);
      res.json({ 
        authenticated: true, 
        user: { 
          id: user.id, 
          email: user.email, 
          name: user.name 
        }
      });
    } catch (error) {
      res.status(500).json({ authenticated: false, error: error.message });
    }
  } else {
    res.status(401).json({ authenticated: false });
  }
});

module.exports = router;