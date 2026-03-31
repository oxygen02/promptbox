const express = require('express');
const https = require('https');
const router = express.Router();

const QWEN_CONFIG = {
  endpoint: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
  model: 'qwen-plus',
  apiKey: process.env.QWEN_API_KEY || ''
};

function callAIAPI(prompt, config) {
  return new Promise((resolve) => {
    const postData = JSON.stringify({
      model: config.model,
      messages: [
        { role: 'system', content: '你是一个专业的提示词优化助手。' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 1500,
      temperature: 0.9
    });

    const url = new URL(config.endpoint);
    const options = {
      hostname: url.hostname,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Length': Buffer.byteLength(postData)
      },
      timeout: 20000
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

router.post('/analyze', async (req, res) => {
  try {
    const { content, dimensions, contentType, models } = req.body;
    
    console.log('=== ANALYZE ===');
    console.log('Models:', models);

    if (!content) return res.status(400).json({ error: 'Content required' });

    const modelList = models && models.length > 0 ? models : ['qwen-plus'];
    const dims = dimensions?.join('、') || '通用';
    const results = {};
    
    // 确保每个模型生成不同的内容
    for (let i = 0; i < modelList.length; i++) {
      const modelKey = modelList[i];
      const uniqueId = `【${i+1}】`;
      
      const prompt = `${uniqueId}请根据以下内容生成一个专属的AI提示词。

【重要】你必须为【${modelKey}】模型生成提示词，这是第${i+1}个模型。
要求：
1. 必须提到"${modelKey}模型专用"
2. 结合该模型的特点生成专属提示词
3. 输出格式要与第${i===0?2:1}个模型明显不同

原始内容：${content}
维度：${dims}

直接输出专属提示词，不要有其他说明。`;
      
      console.log(`Generating for ${modelKey}...`);
      
      if (QWEN_CONFIG.apiKey) {
        const result = await callAIAPI(prompt, QWEN_CONFIG);
        results[modelKey] = result.success ? result.content : `[${modelKey}] 提示词 - ${content.substring(0,100)}`;
      } else {
        results[modelKey] = `【${modelKey}模型专用提示词】\n维度：${dims}\n内容：${content.substring(0,150)}...`;
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
