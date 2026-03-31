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
      max_tokens: 1000,
      temperature: 0.7
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
      timeout: 15000
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
            resolve({ success: false, error: 'API error: ' + data.substring(0, 100) });
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

const MODEL_SPECS = {
  'deepseek-chat': 'DeepSeek擅长逻辑推理和代码生成，提示词应强调结构化输出和推理步骤',
  'kimi': 'Kimi擅长长文本理解，提示词应充分利用超长上下文优势',
  'gpt4o': 'GPT-4o通用能力强，提示词应明确任务目标和输出格式',
  'claude-3.5': 'Claude擅长分析和解释，提示词应逻辑严密、条理清晰',
  'qwen-plus': 'Qwen擅长中文理解生成，提示词应适合中文场景',
  'gemini-pro': 'Gemini多模态能力强，提示词应综合性强',
};

router.post('/analyze', async (req, res) => {
  try {
    const { content, dimensions, contentType, models } = req.body;
    
    console.log('=== ANALYZE REQUEST ===');
    console.log('Content length:', content?.length);
    console.log('Content preview:', content?.substring(0, 100));
    console.log('Dimensions:', dimensions);
    console.log('Models:', models);
    console.log('=====================');

    if (!content) return res.status(400).json({ error: 'Content required' });

    const modelList = models && models.length > 0 ? models : ['qwen-plus'];
    const dims = dimensions?.join('、') || '通用';
    const results = {};
    
    for (const modelKey of modelList) {
      console.log(`Generating for model: ${modelKey}`);
      const modelSpec = MODEL_SPECS[modelKey] || `针对${modelKey}模型`;
      const prompt = `根据以下内容生成适合${modelKey}的提示词。${modelSpec}\n\n原始内容：${content}\n维度：${dims}\n\n直接输出提示词。`;
      
      if (QWEN_CONFIG.apiKey) {
        const result = await callAIAPI(prompt, QWEN_CONFIG);
        console.log(`Result for ${modelKey}:`, result.success ? 'OK' : result.error);
        results[modelKey] = result.success ? result.content : `【${modelKey}】提示词 - 内容：${content.substring(0,50)}...`;
      } else {
        results[modelKey] = `【${modelKey}】专属提示词\n维度：${dims}\n内容：${content.substring(0,100)}...`;
      }
    }

    console.log('All results:', Object.keys(results));
    res.json({ success: true, results });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
