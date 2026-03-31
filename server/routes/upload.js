const express = require('express');
const router = express.Router();
const mammoth = require('mammoth');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

router.post('/parse', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }
    
    const file = req.file;
    let content = '';
    
    if (file.originalname.endsWith('.docx')) {
      const result = await mammoth.extractRawText({ buffer: file.buffer });
      content = result.value;
    } else {
      content = file.buffer.toString('utf-8');
    }
    
    res.json({ success: true, content: content });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
