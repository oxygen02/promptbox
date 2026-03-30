const express = require('express');
const router = express.Router();

// In-memory points storage
const userPoints = new Map();

// Initialize guest user
userPoints.set('guest', { points: 100, history: [] });

// Get user points
router.get('/', (req, res) => {
  const { userId = 'guest' } = req.query;
  
  const user = userPoints.get(userId) || { points: 0, history: [] };
  
  res.json({
    success: true,
    userId,
    points: user.points,
    history: user.history
  });
});

// Add points
router.post('/add', (req, res) => {
  const { userId = 'guest', amount, reason } = req.body;
  
  if (!amount || amount <= 0) {
    return res.status(400).json({ success: false, error: 'Invalid amount' });
  }
  
  let user = userPoints.get(userId) || { points: 0, history: [] };
  user.points += amount;
  user.history.push({
    action: 'add',
    amount,
    reason,
    timestamp: new Date().toISOString()
  });
  
  userPoints.set(userId, user);
  
  res.json({
    success: true,
    points: user.points,
    history: user.history
  });
});

// Deduct points
router.post('/deduct', (req, res) => {
  const { userId = 'guest', amount, reason } = req.body;
  
  if (!amount || amount <= 0) {
    return res.status(400).json({ success: false, error: 'Invalid amount' });
  }
  
  let user = userPoints.get(userId) || { points: 0, history: [] };
  
  if (user.points < amount) {
    return res.status(400).json({ success: false, error: 'Insufficient points' });
  }
  
  user.points -= amount;
  user.history.push({
    action: 'deduct',
    amount,
    reason,
    timestamp: new Date().toISOString()
  });
  
  userPoints.set(userId, user);
  
  res.json({
    success: true,
    points: user.points,
    history: user.history
  });
});

module.exports = router;
