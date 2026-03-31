const express = require('express');
const https = require('https');
const router = express.Router();

// DeepSeek API 配置
const DEEPSEEK_CONFIG = {
  endpoint: 'https://api.deepseek.com/chat/completions',
  model: 'deepseek-chat',
  apiKey: process.env.DEEPSEEK_API_KEY || ''
};

// 阿里云千问 API 配置
const QWEN_CONFIG = {
  endpoint: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
  model: 'qwen-plus',
  apiKey: process.env.QWEN_API_KEY || ''
};

// 使用 https 模块调用 AI API
function callAIAPI(prompt, config) {
  return new Promise((resolve) => {
    const postData = JSON.stringify({
      model: config.model,
      messages: [
        { role: 'system', content: '你是一个专业的提示词优化助手，帮助用户生成高质量的AI提示词。' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 2000,
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
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.choices && json.choices[0]) {
            resolve({
              success: true,
              content: json.choices[0].message.content,
              model: config.model,
              usage: json.usage
            });
          } else if (json.error) {
            resolve({ success: false, error: json.error.message || 'API error' });
          } else {
            resolve({ success: false, error: 'Invalid response' });
          }
        } catch (e) {
          resolve({ success: false, error: e.message });
        }
      });
    });

    req.on('error', (e) => {
      resolve({ success: false, error: e.message });
    });

    req.write(postData);
    req.end();
  });
}

// 分析单个模型
async function analyzeForModel(content, dimensions, contentType, modelName, apiConfig) {
  const dims = dimensions?.join('、') || '通用';
  const contentTypeName = contentType === 'text' ? '文字文档' : 
                          contentType === 'image' ? '图片视觉' : 
                          contentType === 'video' ? '视频解构' : '网页设计';
  
  const prompt = `请根据以下内容，为【${modelName}】模型生成一个专属的AI提示词。

## 原始内容：
${content}

## 内容类型：${contentTypeName}
## 分析维度：${dims}

请为${modelName}模型生成一个专业、结构化的提示词，要求：
1. 适合${modelName}模型的特点和优势
2. 包含角色设定、任务描述、输出格式要求
3. 提示词要能充分发挥该模型的能力

请直接输出提示词内容，不需要其他说明。`;

  if (apiConfig && apiConfig.apiKey) {
    const result = await callAIAPI(prompt, apiConfig);
    if (result.success) {
      return result.content;
    }
  }
  
  // 回退到本地生成
  return `# ${modelName} 提示词

## 分析维度
${dims}

## 原始内容要点
${content.substring(0, 200)}...

## 提示词模板
你是一位专业的${contentTypeName}分析师。根据上述内容，按照[${dims}]维度进行分析...`;
}

// 提示词分析 - 支持多模型
router.post('/analyze', async (req, res) => {
  try {
    const { content, dimensions, contentType, models } = req.body;

    if (!content) {
      return res.status(400).json({ success: false, error: 'Content is required' });
    }

    console.log('Analyzing content with dimensions:', dimensions, 'models:', models);

    // 默认模型列表
    const modelList = models && models.length > 0 ? models : ['deepseek'];
    
    // 为每个模型生成专属提示词
    const results = {};
    
    for (const modelKey of modelList) {
      let apiConfig = null;
      let modelName = modelKey;
      
      // 确定使用哪个 API
      if (modelKey.includes('deepseek') && DEEPSEEK_CONFIG.apiKey) {
        apiConfig = DEEPSEEK_CONFIG;
        modelName = 'DeepSeek';
      } else if (modelKey.includes('kimi') || modelKey.includes('qwen') || modelKey.includes('moonshot')) {
        if (QWEN_CONFIG.apiKey) {
          apiConfig = QWEN_CONFIG;
          modelName = 'Kimi';
        }
      } else if (QWEN_CONFIG.apiKey) {
        // 默认使用千问
        apiConfig = QWEN_CONFIG;
        modelName = 'AI助手';
      }
      
      console.log(`Generating prompt for model: ${modelKey}`);
      const prompt = await analyzeForModel(content, dimensions, contentType, modelName, apiConfig);
      results[modelKey] = prompt;
    }

    res.json({
      success: true,
      results: results,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Analyze error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
