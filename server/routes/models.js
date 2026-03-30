const express = require('express');
const router = express.Router();

// AI 模型列表
const MODELS = [
  { key: "deepseek", name: "DeepSeek", region: "Global", type: "chat", pricing: { input: 0.001, output: 0.002 } },
  { key: "kimi", name: "Kimi", region: "CN", type: "chat", pricing: { input: 0.012, output: 0.012 } },
  { key: "minimax", name: "MiniMax", region: "CN", type: "chat", pricing: { input: 0.01, output: 0.01 } },
  { key: "gpt4o", name: "GPT-4o", region: "Global", type: "chat", pricing: { input: 0.005, output: 0.015 } },
  { key: "claude", name: "Claude 3.5 Sonnet", region: "Global", type: "chat", pricing: { input: 0.003, output: 0.015 } },
  { key: "gemini", name: "Gemini Pro", region: "Global", type: "chat", pricing: { input: 0.0005, output: 0.0015 } },
  { key: "qwen", name: "通义千问", region: "CN", type: "chat", pricing: { input: 0.008, output: 0.008 } },
  { key: "zhipu", name: "智谱清言", region: "CN", type: "chat", pricing: { input: 0.01, output: 0.01 } },
  { key: "yi", name: "Yi", region: "CN", type: "chat", pricing: { input: 0.006, output: 0.006 } },
  { key: "spark", name: "讯飞星火", region: "CN", type: "chat", pricing: { input: 0.012, output: 0.012 } },
];

// 获取模型列表
router.get('/', (req, res) => {
  const { region, type } = req.query;
  
  let filteredModels = [...MODELS];
  
  if (region) {
    filteredModels = filteredModels.filter(m => m.region === region);
  }
  
  if (type) {
    filteredModels = filteredModels.filter(m => m.type === type);
  }
  
  res.json({
    success: true,
    data: filteredModels,
    total: filteredModels.length
  });
});

// 获取单个模型信息
router.get('/:key', (req, res) => {
  const { key } = req.params;
  const model = MODELS.find(m => m.key === key);
  
  if (!model) {
    return res.status(404).json({ success: false, error: 'Model not found' });
  }
  
  res.json({ success: true, data: model });
});

module.exports = router;
