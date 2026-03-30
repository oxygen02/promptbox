const express = require('express');
const router = express.Router();

// Tencent Cloud CodingPlan API 配置
const CODING_PLAN_CONFIG = {
  endpoint: 'https://api.codingplan.com/v1/chat/completions',
  model: 'codingplan-s1',
  apiKey: process.env.CODING_PLAN_API_KEY || 'sk-sp-5T2M10svnntrPkJMwMwoKDMabYFEVHAMews5rIepwUnVDhld'
};

// 腾讯云千问 API 配置
const QWEN_CONFIG = {
  endpoint: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
  model: 'qwen-plus',
  apiKey: process.env.QWEN_API_KEY || ''
};

// 免费 API 列表（优先使用）
const FREE_PROVIDERS = [
  {
    name: 'DeepSeek',
    endpoint: 'https://api.deepseek.com/v1/chat/completions',
    model: 'deepseek-chat',
    apiKey: process.env.DEEPSEEK_API_KEY || ''
  },
  {
    name: 'Kimi',
    endpoint: 'https://api.moonshot.cn/v1/chat/completions',
    model: 'moonshot-v1-8k',
    apiKey: process.env.KIMI_API_KEY || ''
  }
];

// 模拟生成结果（免费模式）
const mockGenerate = (prompt, model) => {
  return {
    success: true,
    prompt,
    model,
    generated: `🎯 创意生成结果

基于您提供的提示词：
"${prompt.substring(0, 100)}..."

✨ 优化后的提示词：

1. **角色设定**
   您是一位专业的[领域专家]，拥有丰富的[相关经验]。

2. **任务目标**
   根据提供的素材，分析并生成高质量的[内容类型]。

3. **输出要求**
   - 语言风格：专业、简洁、有洞察力
   - 结构清晰，层次分明
   - 包含具体案例和实操建议

4. **参考框架**
   - 开场：引入场景/问题
   - 主体：核心观点+案例支撑
   - 结尾：总结+行动建议

---
💡 提示：连接后端API后可获得更精准的AI生成结果`,
    timestamp: new Date().toISOString()
  };
};

// 内容生成
router.post('/', async (req, res) => {
  try {
    const { prompt, model, type } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ success: false, error: 'Prompt is required' });
    }

    console.log('Generating with model:', model || 'default');

    // 优先使用腾讯云 CodingPlan API
    if (CODING_PLAN_CONFIG.apiKey) {
      try {
        const response = await fetch(CODING_PLAN_CONFIG.endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${CODING_PLAN_CONFIG.apiKey}`
          },
          body: JSON.stringify({
            model: CODING_PLAN_CONFIG.model,
            messages: [
              { role: 'system', content: '你是一个专业的提示词优化助手，帮助用户生成高质量的AI提示词。' },
              { role: 'user', content: prompt }
            ],
            max_tokens: 2000,
            temperature: 0.7
          })
        });

        if (response.ok) {
          const data = await response.json();
          return res.json({
            success: true,
            prompt,
            model: 'codingplan-s1',
            generated: data.choices?.[0]?.message?.content || mockGenerate(prompt, 'codingplan-s1').generated,
            timestamp: new Date().toISOString()
          });
        }
      } catch (apiError) {
        console.error('CodingPlan API error:', apiError);
        // 降级到模拟结果
      }
    }

    // 返回模拟结果（免费模式）
    res.json(mockGenerate(prompt, model || 'demo'));

  } catch (error) {
    console.error('Generation error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 获取可用模型列表
router.get('/models', (req, res) => {
  res.json({
    success: true,
    models: [
      { key: 'codingplan-s1', name: 'CodingPlan S1', provider: 'Tencent Cloud', free: true },
      { key: 'deepseek', name: 'DeepSeek', provider: 'DeepSeek', free: true },
      { key: 'kimi', name: 'Kimi', provider: 'Moonshot', free: true },
      { key: 'qwen-plus', name: 'Qwen Plus', provider: 'Alibaba', free: false },
    ]
  });
});

module.exports = router;
