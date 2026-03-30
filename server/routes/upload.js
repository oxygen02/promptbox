const express = require('express');
const router = express.Router();

// Mock upload - stores files in memory (replace with cloud storage in production)
const uploads = new Map();

// Handle file/URL upload
router.post('/', async (req, res) => {
  try {
    const { url, type, content } = req.body;
    
    const uploadId = `upload_${Date.now()}`;
    
    if (url) {
      // URL upload
      uploads.set(uploadId, {
        id: uploadId,
        type: 'url',
        url,
        contentType: type,
        createdAt: new Date().toISOString()
      });
    } else if (content) {
      // Text content
      uploads.set(uploadId, {
        id: uploadId,
        type: 'text',
        content,
        contentType: type,
        createdAt: new Date().toISOString()
      });
    } else {
      return res.status(400).json({ success: false, error: 'No content provided' });
    }
    
    res.json({
      success: true,
      uploadId,
      message: 'Upload successful'
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get upload status
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const upload = uploads.get(id);
  
  if (!upload) {
    return res.status(404).json({ success: false, error: 'Upload not found' });
  }
  
  res.json({ success: true, data: upload });
});

module.exports = router;
