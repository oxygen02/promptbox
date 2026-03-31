const express = require('express');
const axios = require('axios');
const router = express.Router();

// 阿里云通义万相 API 配置 (免费使用)
const WANXIANG_CONFIG = {
  endpoint: 'https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation',
  model: 'wan2.6-t2i',
  apiKey: process.env.QWEN_API_KEY || ''
};

console.log('=== ImageGen Router Loaded ===');
console.log('API Key present:', !!WANXIANG_CONFIG.apiKey);
console.log('API Key prefix:', WANXIANG_CONFIG.apiKey ? WANXIANG_CONFIG.apiKey.substring(0, 10) : 'none');

// 生成图片
router.post('/', async (req, res) => {
  try {
    const { prompt, imageCount = 1 } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ success: false, error: 'Prompt is required' });
    }

    console.log('Generating images with prompt:', prompt.substring(0, 50), 'count:', imageCount);

    // 使用通义万相 API (免费) - wan2.6-t2i
    if (WANXIANG_CONFIG.apiKey) {
      try {
        const response = await axios.post(
          WANXIANG_CONFIG.endpoint,
          {
            model: WANXIANG_CONFIG.model,
            input: {
              messages: [
                {
                  role: "user",
                  content: [
                    { text: prompt }
                  ]
                }
              ]
            },
            parameters: {
              prompt_extend: false,
              watermark: false,
              n: Math.min(imageCount, 4),
              size: "1024*1024"
            }
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${WANXIANG_CONFIG.apiKey}`
            },
            timeout: 60000
          }
        );

        console.log('Wanxiang response:', response.data);

        if (response.data && response.data.output && response.data.output.choices) {
          const images = response.data.output.choices
            .filter(function(c) { return c.message && c.message.content; })
            .map(function(c) { return c.message.content[0].image; });
          
          if (images.length > 0) {
            return res.json({
              success: true,
              images: images,
              prompt,
              model: 'wan2.6-t2i'
            });
          }
        }
      } catch (apiError) {
        console.error('Wanxiang API error:', apiError.message);
        if (apiError.response) {
          console.error('Error response:', apiError.response.data);
        }
      }
    }

    // 如果API不可用，返回占位图片
    const placeholderImages = [];
    for (let i = 0; i < imageCount; i++) {
      placeholderImages.push(`https://picsum.photos/seed/${Date.now() + i}/1024/1024`);
    }

    res.json({
      success: true,
      images: placeholderImages,
      prompt,
      model: 'placeholder',
      note: 'API暂不可用，使用占位图'
    });

  } catch (error) {
    console.error('Image generation error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;