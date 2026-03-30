const express = require('express');
const router = express.Router();

// AI 分析配置
// 免费优先策略：优先使用免费API，备用付费
const AI_PROVIDERS = {
  // 免费API
  free: [
    { name: 'DeepSeek', key: 'deepseek', endpoint: 'https://api.deepseek.com/v1/chat/completions', model: 'deepseek-chat', free: true },
    { name: 'Kimi', key: 'kimi', endpoint: 'https://api.moonshot.cn/v1/chat/completions', model: 'moonshot-v1-8k', free: false },
    { name: 'MiniMax', key: 'minimax', endpoint: 'https://api.minimax.chat/v1/text/chatcompletion_v2', model: 'abab6.5s-chat', free: false },
  ],
  // 付费API（备用）
  paid: [
    { name: 'Qwen', key: 'qwen', endpoint: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions', model: 'qwen-plus', apiKey: process.env.QWEN_API_KEY },
    { name: 'GPT-4o', key: 'gpt4o', endpoint: 'https://api.openai.com/v1/chat/completions', model: 'gpt-4o', apiKey: process.env.OPENAI_API_KEY },
  ]
};

// 内容分析
router.post('/', async (req, res) => {
  try {
    const { content, type, dimensions } = req.body;
    
    if (!content) {
      return res.status(400).json({ success: false, error: 'Content is required' });
    }

    // 模拟分析结果
    const analysis = {
      success: true,
      content,
      type,
      dimensions: dimensions || [],
      tags: getTagsForType(type),
      prompt: generatePrompt(content, type, dimensions),
      timestamp: new Date().toISOString()
    };

    res.json(analysis);
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 根据内容类型获取标签
function getTagsForType(type) {
  const tags = {
    text: ['通用创作', '核心观点', '文案逻辑', '短视频脚本', '营销转化'],
    image: ['Midjourney', '风格提取', '色彩搭配', '构图光影', '电商商品'],
    video: ['Pika', '运镜转场', '画面风格', '剧情脚本', '分镜设计'],
    web: ['V0建站', '结构组件', '设计配色', '交互逻辑', 'React组件']
  };
  return tags[type] || tags.text;
}

// 生成提示词
function generatePrompt(content, type, dimensions) {
  const dimensionText = dimensions.length > 0 ? dimensions.join(', ') : '通用';
  return `[${type}] ${dimensionText}\n\n${content}\n\n请根据以上内容生成专业提示词。`;
}

module.exports = router;
