const express = require('express');
const router = express.Router();
const mammoth = require('mammoth');

router.use(express.json({ limit: '10mb' }));
router.use(express.urlencoded({ extended: true }));

// Simple file upload handler - use multer
const multer = require('multer');
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }
});

router.post('/parse', upload.single('file'), async (req, res) => {
  console.log('Upload request received');
  console.log('File:', req.file);
  
  if (!req.file) {
    console.log('No file in request');
    return res.status(400).json({ success: false, error: 'No file uploaded' });
  }
  
  try {
    const file = req.file;
    let content = '';
    
    if (file.originalname.endsWith('.docx')) {
      const result = await mammoth.extractRawText({ buffer: file.buffer });
      content = result.value;
    } else {
      content = file.buffer.toString('utf-8');
    }
    
    console.log('Content length:', content.length);
    res.json({ success: true, content: content });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
