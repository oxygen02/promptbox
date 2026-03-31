const express = require('express');
const router = express.Router();
const multer = require('multer');
const mammoth = require('mammoth');

// 配置 multer 用于文件上传
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// 解析文件内容
router.post('/parse', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    const file = req.file;
    let content = '';

    if (file.originalname.endsWith('.docx')) {
      // 解析 DOCX 文件
      const result = await mammoth.extractRawText({ buffer: file.buffer });
      content = result.value;
    } else if (file.mimetype.includes('text') || 
               file.originalname.endsWith('.txt') ||
               file.originalname.endsWith('.md')) {
      // 纯文本文件
      content = file.buffer.toString('utf-8');
    } else if (file.mimetype.includes('image')) {
      // 图片文件 - 返回图片信息
      return res.json({
        success: true,
        content: `[图片文件] ${file.originalname}`,
        isImage: true,
        fileName: file.originalname
      });
    } else {
      return res.json({
        success: true,
        content: `[文件] ${file.originalname}`,
        fileName: file.originalname
      });
    }

    res.json({
      success: true,
      content: content,
      fileName: file.originalname
    });

  } catch (error) {
    console.error('File parse error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
