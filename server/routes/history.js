const express = require('express');
const router = express.Router();

// In-memory storage (replace with database in production)
const history = [];

// Get user history
router.get('/', (req, res) => {
  const { userId, limit = 20 } = req.query;
  
  let userHistory = history;
  if (userId) {
    userHistory = history.filter(h => h.userId === userId);
  }
  
  userHistory = userHistory.slice(-parseInt(limit));
  
  res.json({
    success: true,
    data: userHistory,
    total: userHistory.length
  });
});

// Add to history
router.post('/', (req, res) => {
  const { userId, prompt, result, type, model } = req.body;
  
  const item = {
    id: `history_${Date.now()}`,
    userId: userId || 'guest',
    prompt,
    result,
    type,
    model,
    createdAt: new Date().toISOString()
  };
  
  history.unshift(item);
  
  // Keep only last 100 items
  if (history.length > 100) {
    history.pop();
  }
  
  res.json({ success: true, data: item });
});

// Delete history item
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const index = history.findIndex(h => h.id === id);
  
  if (index > -1) {
    history.splice(index, 1);
    res.json({ success: true });
  } else {
    res.status(404).json({ success: false, error: 'Not found' });
  }
});

module.exports = router;
