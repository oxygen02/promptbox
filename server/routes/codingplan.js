const express = require('express');
const router = express.Router();

// 腾讯云 CodingPlan API 配置
const CODING_PLAN_CONFIG = {
  endpoint: 'https://api.codingplan.com/v1/chat/completions',
  model: 'codingplan-s1',
  apiKey: process.env.CODING_PLAN_CONFIG.apiKey || 'sk-sp-5T2M10svnntrPkJMwMwoKDMabYFEVHAMews5rIepwUnVDhld'
};

// 调用腾讯云 CodingPlan API
async function callCodingPlanAPI(prompt, model = 'codingplan-s1') {
  try {
    const response = await fetch(CODING_PLAN_CONFIG.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CODING_PLAN_CONFIG.apiKey}`
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: 'system', content: '你是一个专业的提示词优化助手，帮助用户生成高质量的AI提示词。请根据用户提供的素材和维度，分析并生成精准的提示词。' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 2000,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    return {
      success: true,
      content: data.choices?.[0]?.message?.content || '',
      model: model,
      usage: data.usage
    };
  } catch (error) {
    console.error('CodingPlan API Error:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

// 提示词分析生成
router.post('/analyze', async (req, res) => {
  try {
    const { content, dimensions, contentType, models } = req.body;

    if (!content) {
      return res.status(400).json({ success: false, error: 'Content is required' });
    }

    console.log('Analyzing content with dimensions:', dimensions);

    // 构建分析提示词
    const prompt = `请根据以下内容进行分析，提取关键信息并生成适合AI使用的提示词。

## 原始内容：
${content}

## 内容类型：${contentType || '文字文档'}
## 分析维度：${dimensions?.join('、') || '通用'}

请按以下格式输出：
1. 提取的核心信息
2. 关键要点
3. 适合的AI提示词模板`;

    // 调用腾讯云 CodingPlan API
    const result = await callCodingPlanAPI(prompt, 'codingplan-s1');

    if (result.success) {
      return res.json({
        success: true,
        result: result.content,
        model: 'codingplan-s1',
        timestamp: new Date().toISOString()
      });
    }

    // 如果API调用失败，返回模拟结果
    res.json({
      success: true,
      result: `分析维度：${dimensions?.join('、') || '通用'}\n\n原始内容预览：${content.substring(0, 200)}...\n\n请连接后端API获取真正的AI分析结果。`,
      model: 'demo',
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

    console.log('Generating with model:', model || 'codingplan-s1');

    const result = await callCodingPlanAPI(prompt, model || 'codingplan-s1');

    if (result.success) {
      return res.json({
        success: true,
        generated: result.content,
        model: model || 'codingplan-s1',
        timestamp: new Date().toISOString()
      });
    }

    // 模拟结果
    res.json({
      success: true,
      generated: `基于提示词 "${prompt.substring(0, 50)}..." 的创意生成结果\n\n请连接后端API获取真正的AI生成结果。`,
      model: 'demo',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Generate error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
