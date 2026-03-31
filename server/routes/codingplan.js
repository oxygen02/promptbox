const express = require('express');
const https = require('https');
const axios = require('axios');
const cheerio = require('cheerio');
const router = express.Router();

// 阿里云千问 API 配置
const QWEN_CONFIG = {
  endpoint: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
  model: 'qwen-plus',
  apiKey: process.env.QWEN_API_KEY || ''
};

// 网页内容提取
async function fetchWebPage(url) {
  try {
    const response = await axios.get(url, {
      timeout: 15000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      maxContentLength: 5 * 1024 * 1024
    });
    
    const $ = cheerio.load(response.data);
    
    // 提取标题
    const title = $('title').text() || $('h1').first().text() || '';
    
    // 移除脚本和样式
    $('script, style, nav, footer, header').remove();
    
    // 提取主要文本内容
    const text = $('body').text().trim();
    // 清理空白字符
    const cleanText = text.replace(/\s+/g, ' ').substring(0, 5000);
    
    return {
      success: true,
      title: title.trim(),
      content: cleanText,
      url: url
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

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
    let { content, dimensions, contentType, models } = req.body;
    
    console.log('=== ANALYZE (Qwen) ===');
    console.log('Content type:', contentType);
    console.log('Models:', models);

    // 如果content是URL，先获取网页内容
    if (content && typeof content === 'string' && contentType === 'web') {
      // 检查是否是URL格式
      const urlPattern = /^(https?:\/\/)/i;
      if (urlPattern.test(content.trim())) {
        console.log('Fetching web page:', content);
        const webResult = await fetchWebPage(content.trim());
        
        if (webResult.success && webResult.content) {
          // 合并标题和内容
          content = `【网页标题】${webResult.title}\n\n【网页内容】${webResult.content}`;
          console.log('Web page fetched, content length:', content.length);
        } else {
          console.log('Web fetch failed:', webResult.error);
          // 继续使用原始URL作为内容
        }
      }
    }

    if (!content) return res.status(400).json({ error: 'Content required' });

    const modelList = models && models.length > 0 ? models : ['qwen-plus'];
    const dims = dimensions?.join('、') || '通用';
    const results = {};
    
    for (const modelKey of modelList) {
      console.log(`Generating for ${modelKey}`);
      
      const prompt = `请根据以下内容，按照选定的【分析维度】进行深度分析并生成AI提示词。

【选定分析维度】：${dims}
【重要】请严格按照以上维度进行分析，生成针对每个维度的专属提示词。

原始内容：${content}

要求：
1. 针对【${dims}】每个维度分别生成对应的提示词内容
2. 如果维度是"整体描述"，请对内容进行整体概括性描述
3. 如果维度是"优化建议"，请提供具体的改进建议
4. 其他维度请按其名称进行针对性分析
5. 提示词开头必须标明【${modelKey}模型专用】
6. 输出格式要清晰区分各个维度

直接输出提示词内容，不要有多余的说明。`;
      
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
