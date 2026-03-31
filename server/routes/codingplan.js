const express = require('express');
const https = require('https');
const router = express.Router();

// 阿里云千问 API 配置
const QWEN_CONFIG = {
  endpoint: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
  model: 'qwen-plus',
  apiKey: process.env.QWEN_API_KEY || ''
};

// 调用千问 API
function callQwenAPI(prompt, apiKey) {
  return new Promise((resolve) => {
    const postData = JSON.stringify({
      model: QWEN_CONFIG.model,
      messages: [
        { role: 'system', content: '你是一个专业的提示词优化助手。' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 2000,
      temperature: 0.8
    });

    const url = new URL(QWEN_CONFIG.endpoint);
    const options = {
      hostname: url.hostname,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
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
            resolve({ success: false, error: 'API error' });
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
    
    console.log('=== ANALYZE (Qwen) ===');
    console.log('Models:', models);

    if (!content) return res.status(400).json({ error: 'Content required' });

    const modelList = models && models.length > 0 ? models : ['qwen-plus'];
    const dims = dimensions?.join('、') || '通用';
    const results = {};
    
    for (const modelKey of modelList) {
      console.log(`Generating for ${modelKey}`);
      
      const prompt = `请根据以下内容，为【${modelKey}】模型生成一个专属的AI提示词。

【重要】这是专门为${modelKey}模型生成的提示词，必须体现该模型的特点。

原始内容：${content}
分析维度：${dims}

要求：
1. 提示词开头必须标明【${modelKey}模型专用】
2. 结合${modelKey}的能力特点生成专属提示词
3. 输出格式要与其他模型有明显区别

直接输出提示词内容。`;
      
      if (QWEN_CONFIG.apiKey) {
        const result = await callQwenAPI(prompt, QWEN_CONFIG.apiKey);
        results[modelKey] = result.success ? result.content : `【${modelKey}模型专用提示词】\n\n维度：${dims}\n\n${content.substring(0, 200)}...`;
      } else {
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
