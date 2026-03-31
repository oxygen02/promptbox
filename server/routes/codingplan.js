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

// 所有模型的特定指令
const MODEL_SPECS = {
  // 文字模型
  'deepseek-chat': `针对DeepSeek Chat模型：
- 擅长逻辑推理和代码生成
- 输出结构化、逻辑清晰
- 适合深度分析任务`,
  
  'kimi': `针对Kimi模型：
- 擅长长文本理解和超长上下文
- 适合全面详细的分析
- 支持超长输入`,
  
  'qwen-plus': `针对Qwen Plus模型：
- 擅长中文理解和生成
- 知识面广
- 适合中文内容处理`,
  
  'qwen-turbo': `针对Qwen Turbo模型：
- 响应速度快
- 适合快速生成
- 性价比高`,
  
  'yi-light': `针对Yi Light模型：
- 擅长中英双语
- 轻量快速
- 适合简单任务`,
  
  'gpt4o': `针对GPT-4o模型：
- 通用能力最强
- 多领域精通
- 适合高质量内容生成`,
  
  'claude-3.5': `针对Claude 3.5 Sonnet模型：
- 思维清晰、逻辑严密
- 擅长分析和解释
- 适合深入分析`,
  
  'spark-4': `针对Spark 4.0模型：
- 擅长中文对话
- 适合日常场景
- 响应友好`,

  // 视觉模型
  'gemini-pro': `针对Gemini Pro Vision模型：
- 多模态能力强大
- 擅长图像和视频理解
- 适合视觉分析任务`,
  
  'kimi-vl': `针对Kimi-VL模型：
- 视觉理解能力强
- 擅长图像分析
- 支持长文本+图片`,
  
  'qwen-vl': `针对Qwen-VL模型：
- 擅长中文图像理解
- 细粒度视觉分析
- 适合中文图片任务`,
  
  'minimax-vision': `针对MiniMax-Vision模型：
- 多模态理解
- 创意图像分析
- 适合创意任务`,
  
  'deepseek-vl': `针对DeepSeek-VL模型：
- 视觉推理能力强
- 适合复杂图像分析
- 免费使用`,
  
  'yi-vision': `针对Yi-Vision模型：
- 中英双语视觉理解
- 适合双语图像任务`,
  
  'claude-3.5': `针对Claude 3.5视觉模型：
- 详细图像分析
- 视觉推理能力强
- 适合复杂图像任务`,

  // 视频模型
  'minimax-video': `针对MiniMax-Video模型：
- 视频理解分析
- 关键帧提取
- 适合视频内容分析`,

  // 网页设计模型
  'deepseek-chat': `针对DeepSeek模型（网页设计）：
- 擅长代码生成
- 理解技术实现
- 适合前端开发任务`,
};

// 分析单个模型
async function analyzeForModel(content, dimensions, contentType, modelKey, apiConfig) {
  const dims = dimensions?.join('、') || '通用';
  const contentTypeName = contentType === 'text' ? '文字文档' : 
                          contentType === 'image' ? '图片视觉' : 
                          contentType === 'video' ? '视频解构' : '网页设计';
  
  const modelSpec = MODEL_SPECS[modelKey] || `针对${modelKey}模型生成专属提示词`;
  
  const prompt = `请根据以下内容，为【${modelKey}】模型生成一个专属的AI提示词。

${modelSpec}

## 原始内容：
${content}

## 内容类型：${contentTypeName}
## 分析维度：${dims}

请生成一个专业、结构化的提示词，要求：
1. 必须是为${modelKey}模型量身定制的专属提示词
2. 适合该模型的特点和优势
3. 包含角色设定、任务描述、输出格式要求
4. 与其他模型的提示词有明显区别

请直接输出提示词内容，不需要任何说明。`;

  if (apiConfig && apiConfig.apiKey) {
    const result = await callAIAPI(prompt, apiConfig);
    if (result.success) {
      return result.content;
    }
  }
  
  // 回退到本地生成
  return `# ${modelKey} 专属提示词

${modelSpec}

## 分析维度
${dims}

## 内容类型
${contentTypeName}

请根据上述内容生成适合${modelKey}的提示词...`;
}

// 提示词分析 - 支持多模型
router.post('/analyze', async (req, res) => {
  try {
    const { content, dimensions, contentType, models } = req.body;

    if (!content) {
      return res.status(400).json({ success: false, error: 'Content is required' });
    }

    console.log('Analyzing content with dimensions:', dimensions, 'models:', models, 'contentType:', contentType);

    // 默认模型列表
    const modelList = models && models.length > 0 ? models : ['qwen-plus'];
    
    // 为每个模型生成专属提示词
    const results = {};
    
    for (const modelKey of modelList) {
      console.log(`Generating prompt for model: ${modelKey}`);
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
