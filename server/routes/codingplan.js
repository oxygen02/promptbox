const express = require('express');
const https = require('https');
const router = express.Router();

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
      temperature: 0.8
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

// 模型特定的提示词生成要求
const MODEL_SPECIFIC_INSTRUCTIONS = {
  'deepseek': `针对DeepSeek模型的特点：
- 擅长逻辑推理、代码生成和数学计算
- 输出应该结构化、逻辑清晰
- 适合处理需要深度思考的问题
- 提示词应该强调推理过程和步骤`,

  'kimi': `针对Kimi模型的特点：
- 擅长长文本处理和上下文理解
- 支持超长上下文窗口
- 输出应该详细、全面
- 提示词应该充分利用长上下文优势`,

  'gpt4': `针对GPT-4模型的特点：
- 通用能力强，多领域精通
- 擅长创意写作和复杂推理
- 输出应该专业、准确
- 提示词应该明确任务目标和预期输出格式`,

  'default': `生成一个通用的提示词，适合大多数AI模型使用。`
};

// 分析单个模型
async function analyzeForModel(content, dimensions, contentType, modelKey, apiConfig) {
  const dims = dimensions?.join('、') || '通用';
  const contentTypeName = contentType === 'text' ? '文字文档' : 
                          contentType === 'image' ? '图片视觉' : 
                          contentType === 'video' ? '视频解构' : '网页设计';
  
  // 获取模型特定的指令
  let modelInstructions = MODEL_SPECIFIC_INSTRUCTIONS[modelKey] || MODEL_SPECIFIC_INSTRUCTIONS['default'];
  if (modelKey.includes('kimi') || modelKey.includes('moonshot')) {
    modelInstructions = MODEL_SPECIFIC_INSTRUCTIONS['kimi'];
  } else if (modelKey.includes('deepseek')) {
    modelInstructions = MODEL_SPECIFIC_INSTRUCTIONS['deepseek'];
  } else if (modelKey.includes('gpt')) {
    modelInstructions = MODEL_SPECIFIC_INSTRUCTIONS['gpt4'];
  }
  
  const prompt = `请根据以下内容，为【${modelKey}】模型生成一个专属的AI提示词。

${modelInstructions}

## 原始内容：
${content}

## 内容类型：${contentTypeName}
## 分析维度：${dims}

请生成一个专业、结构化的提示词，要求：
1. 必须是针对${modelKey}模型的专属提示词
2. 包含角色设定、任务描述、输出格式要求
3. 提示词要能充分发挥该模型的独特能力
4. 与其他模型的提示词要有明显区别

请直接输出提示词内容，不需要其他说明。`;

  if (apiConfig && apiConfig.apiKey) {
    const result = await callAIAPI(prompt, apiConfig);
    if (result.success) {
      return result.content;
    }
  }
  
  // 回退到本地生成
  return `# ${modelKey} 专属提示词

## 分析维度
${dims}

## 原始内容要点
${content.substring(0, 200)}...

## 提示词要求
${modelInstructions}

## 提示词模板
你是一位专业的${contentTypeName}分析师。根据上述内容，按照[${dims}]维度进行分析，生成适合${modelKey}模型的输出...`;
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
      console.log(`Generating prompt for model: ${modelKey}`);
      
      // 所有模型都使用千问 API，但传入不同的 modelKey 来生成不同的提示词
      const prompt = await analyzeForModel(content, dimensions, contentType, modelKey, QWEN_CONFIG);
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
