const express = require('express');
const router = express.Router();

// Simple in-memory user storage (replace with database in production)
const users = new Map();

// Register
router.post('/register', (req, res) => {
  const { email, password, username } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Email and password required' });
  }
  
  if (users.has(email)) {
    return res.status(400).json({ success: false, error: 'Email already registered' });
  }
  
  const user = {
    id: `user_${Date.now()}`,
    email,
    username: username || email.split('@')[0],
    points: 100, // Welcome bonus
    createdAt: new Date().toISOString()
  };
  
  users.set(email, { ...user, password });
  
  res.json({
    success: true,
    user: { ...user, password: undefined }
  });
});

// Login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Email and password required' });
  }
  
  const user = users.get(email);
  
  if (!user || user.password !== password) {
    return res.status(401).json({ success: false, error: 'Invalid credentials' });
  }
  
  res.json({
    success: true,
    user: { id: user.id, email: user.email, username: user.username, points: user.points }
  });
});

// Get current user (mock)
router.get('/me', (req, res) => {
  // Return guest user for now
  res.json({
    success: true,
    user: {
      id: 'guest',
      username: 'Guest',
      email: 'guest@promptbox.ai',
      points: 100
    }
  });
});

module.exports = router;
