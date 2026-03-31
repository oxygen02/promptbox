const express = require('express');
const router = express.Router();

// 阿里云千问 API 配置
const QWEN_CONFIG = {
  endpoint: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
  model: 'qwen-plus',
  apiKey: process.env.QWEN_API_KEY || ''
};

// 本地分析回退
function localAnalyze(content, dimensions, contentType) {
  const dims = dimensions?.join('、') || '通用';
  const contentTypeName = contentType === 'text' ? '文字文档' : 
                          contentType === 'image' ? '图片视觉' : 
                          contentType === 'video' ? '视频解构' : '网页设计';
  
  const lines = content.split(/[\n，。,.;；]/).filter(l => l.trim().length > 2);
  const keyPoints = lines.slice(0, 5).map(l => '• ' + l.trim()).join('\n');
  const wordCount = content.length;
  
  return `# ${contentTypeName} 分析结果

## 分析维度
${dims}

## 内容概况
- 字数：${wordCount} 字符
- 内容类型：${contentTypeName}

## 提取的关键信息
${keyPoints || '（基于上传内容提取）'}

## 提示词模板
基于上述内容，请根据以下维度生成提示词：
${dims}

请确保提示词：
1. 准确反映原始内容的核心信息
2. 符合选定的分析维度要求
3. 语言清晰、结构化
4. 适合目标AI模型使用`;
}

// 调用千问 API
async function callQwenAPI(prompt, apiKey) {
  try {
    const response = await fetch(QWEN_CONFIG.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: QWEN_CONFIG.model,
        messages: [
          { role: 'system', content: '你是一个专业的提示词优化助手，帮助用户生成高质量的AI提示词。' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 2000,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`API Error: ${response.status} - ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    return {
      success: true,
      content: data.choices?.[0]?.message?.content || '',
      model: QWEN_CONFIG.model,
      usage: data.usage
    };
  } catch (error) {
    console.error('Qwen API Error:', error.message);
    return { success: false, error: error.message };
  }
}

// 提示词分析
router.post('/analyze', async (req, res) => {
  try {
    const { content, dimensions, contentType } = req.body;

    if (!content) {
      return res.status(400).json({ success: false, error: 'Content is required' });
    }

    console.log('Analyzing content with dimensions:', dimensions);

    const prompt = `请根据以下内容进行分析，提取关键信息并生成适合AI使用的提示词。

## 原始内容：
${content}

## 内容类型：${contentType || '文字文档'}
## 分析维度：${dimensions?.join('、') || '通用'}

请按以下格式输出：
1. 提取的核心信息
2. 关键要点
3. 适合的AI提示词模板`;

    // 如果有 API Key，尝试调用千问 API
    if (QWEN_CONFIG.apiKey) {
      console.log('Calling Qwen API...');
      const result = await callQwenAPI(prompt, QWEN_CONFIG.apiKey);
      if (result.success) {
        console.log('Qwen API success!');
        return res.json({
          success: true,
          result: result.content,
          model: result.model,
          timestamp: new Date().toISOString()
        });
      }
      console.log('Qwen API failed:', result.error);
    }

    // 本地分析回退
    console.log('Using local analysis fallback');
    const localResult = localAnalyze(content, dimensions, contentType);
    res.json({
      success: true,
      result: localResult,
      model: 'local-analysis',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Analyze error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 创意生成
router.post('/generate', async (req, res) => {
  try {
    const { prompt, model } = req.body;

    if (!prompt) {
      return res.status(400).json({ success: false, error: 'Prompt is required' });
    }

    console.log('Generating content with model:', model || 'default');

    const fullPrompt = `请根据以下提示词生成内容：\n\n${prompt}\n\n请直接输出生成结果。`;

    if (QWEN_CONFIG.apiKey) {
      const result = await callQwenAPI(fullPrompt, QWEN_CONFIG.apiKey);
      if (result.success) {
        return res.json({
          success: true,
          content: result.content,
          model: result.model,
          timestamp: new Date().toISOString()
        });
      }
    }

    res.json({
      success: true,
      content: `[生成内容]\n\n根据您的提示词生成的内容将显示在这里...`,
      model: 'local-generation',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Generate error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
