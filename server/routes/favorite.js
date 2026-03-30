const express = require('express');
const router = express.Router();

// In-memory favorites (replace with database)
const favorites = [];

// Get user favorites
router.get('/', (req, res) => {
  const { userId } = req.query;
  
  let userFavorites = favorites;
  if (userId) {
    userFavorites = favorites.filter(f => f.userId === userId);
  }
  
  res.json({
    success: true,
    data: userFavorites,
    total: userFavorites.length
  });
});

// Add to favorites
router.post('/', (req, res) => {
  const { userId, prompt, result, type, tags } = req.body;
  
  const item = {
    id: `fav_${Date.now()}`,
    userId: userId || 'guest',
    prompt,
    result,
    type,
    tags: tags || [],
    createdAt: new Date().toISOString()
  };
  
  favorites.unshift(item);
  
  res.json({ success: true, data: item });
});

// Remove from favorites
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const index = favorites.findIndex(f => f.id === id);
  
  if (index > -1) {
    favorites.splice(index, 1);
    res.json({ success: true });
  } else {
    res.status(404).json({ success: false, error: 'Not found' });
  }
});

module.exports = router;
