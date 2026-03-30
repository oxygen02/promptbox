const express = require('express');
const router = express.Router();

// 内容分析
router.post('/', async (req, res) => {
  try {
    const { content, dimensions, contentType } = req.body;
    
    if (!content) {
      return res.status(400).json({ success: false, error: 'Content is required' });
    }

    console.log('Analyzing content with dimensions:', dimensions);

    // 提取关键信息
    const lines = content.split(/[\n，。,.;；]/).filter(l => l.trim().length > 3);
    const keyPoints = lines.slice(0, 8).map(l => '• ' + l.trim()).join('\n');
    
    const result = {
      success: true,
      contentType: contentType || 'text',
      dimensions: dimensions || [],
      keyPoints: keyPoints,
      summary: `已分析 ${content.length} 字符，提取 ${lines.length} 个关键信息点`,
      timestamp: new Date().toISOString()
    };

    res.json(result);

  } catch (error) {
    console.error('Analyze error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
