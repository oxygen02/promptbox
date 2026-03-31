const express = require('express');
const https = require('https');
const router = express.Router();

// 腾讯云 CodingPlan API 配置
const CODING_PLAN_CONFIG = {
  endpoint: 'https://api.codingplan.com/v1/chat/completions',
  apiKey: process.env.CODING_PLAN_API_KEY || 'sk-TYBFiCJwEglKf8PV5yAaFIuTJnDaW5PJ3mfMxim3QUAPp5xC'
};

// Coding Plan 支持的模型映射
const CODING_PLAN_MODELS = {
  'auto': 'tc-code-latest',
  'hunyuan-2.0-instruct': 'hunyuan-2.0-instruct',
  'hunyuan-2.0-thinking': 'hunyuan-2.0-thinking',
  'minimax-m2.5': 'minimax-m2.5',
  'kimi-k2.5': 'kimi-k2.5',
  'glm-5': 'glm-5',
  'hunyuan-t1': 'hunyuan-t1',
  'hunyuan-turbos': 'hunyuan-turbos'
};

// 前端模型映射到 Coding Plan 模型
const MODEL_MAPPING = {
  'deepseek-chat': 'tc-code-latest',  // 使用 Auto
  'kimi': 'kimi-k2.5',
  'minimax': 'minimax-m2.5',
  'gpt4o': 'hunyuan-2.0-instruct',
  'claude-3.5': 'hunyuan-2.0-thinking',
  'gemini-pro': 'glm-5',
  'qwen-plus': 'hunyuan-t1',
  'qwen-turbo': 'hunyuan-turbos',
  'yi-light': 'tc-code-latest'
};

// 调用 Coding Plan API
function callCodingPlanAPI(prompt, modelId) {
  return new Promise((resolve) => {
    const postData = JSON.stringify({
      model: modelId,
      messages: [
        { role: 'system', content: '你是一个专业的提示词优化助手。' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 2000,
      temperature: 0.8
    });

    const url = new URL(CODING_PLAN_CONFIG.endpoint);
    const options = {
      hostname: url.hostname,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CODING_PLAN_CONFIG.apiKey}`,
        'Content-Length': Buffer.byteLength(postData)
      },
      timeout: 30000
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.choices && json.choices[0]) {
            resolve({ success: true, content: json.choices[0].message.content });
          } else {
            resolve({ success: false, error: json.error?.message || 'API error' });
          }
        } catch (e) {
          resolve({ success: false, error: e.message });
        }
      });
    });

    req.on('error', (e) => resolve({ success: false, error: e.message }));
    req.on('timeout', () => { req.destroy(); resolve({ success: false, error: 'Timeout' }); });
    req.write(postData);
    req.end();
  });
}

// 提示词分析
router.post('/analyze', async (req, res) => {
  try {
    const { content, dimensions, contentType, models } = req.body;
    
    console.log('=== ANALYZE ===');
    console.log('Content length:', content?.length);
    console.log('Dimensions:', dimensions);
    console.log('Models:', models);

    if (!content) return res.status(400).json({ error: 'Content required' });

    const modelList = models && models.length > 0 ? models : ['tc-code-latest'];
    const dims = dimensions?.join('、') || '通用';
    const results = {};
    
    for (const modelKey of modelList) {
      // 映射到 Coding Plan 模型
      const codingPlanModel = MODEL_MAPPING[modelKey] || 'tc-code-latest';
      
      console.log(`Generating for ${modelKey} -> ${codingPlanModel}`);
      
      const prompt = `请根据以下内容，为【${modelKey}】模型生成一个专属的AI提示词。

【重要】这是专门为${modelKey}模型生成的提示词，必须体现该模型的特点。

原始内容：${content}
分析维度：${dims}

要求：
1. 提示词开头必须标明【${modelKey}模型专用】
2. 结合${modelKey}的能力特点生成专属提示词
3. 输出格式要与其他模型有明显区别

直接输出提示词内容。`;
      
      const result = await callCodingPlanAPI(prompt, codingPlanModel);
      
      if (result.success) {
        results[modelKey] = result.content;
      } else {
        console.log(`API failed for ${modelKey}:`, result.error);
        results[modelKey] = `【${modelKey}模型专用提示词】\n\n维度：${dims}\n\n${content.substring(0, 200)}...`;
      }
    }

    console.log('Results:', Object.keys(results));
    res.json({ success: true, results });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
