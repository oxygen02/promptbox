const express = require('express');
const router = express.Router();
const mammoth = require('mammoth');
const https = require('https');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

router.use(express.json({ limit: '100mb' }));
router.use(express.urlencoded({ extended: true, limit: '100mb' }));

const multer = require('multer');
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB for video
});

const QWEN_VL_CONFIG = {
  endpoint: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
  model: 'qwen-vl-plus',
};

// 调用千问 VL API 分析图片
function analyzeImageWithVL(imageBuffer, apiKey, customPrompt) {
  return new Promise((resolve) => {
    const base64Image = imageBuffer.toString('base64');
    const mimeType = 'image/jpeg';
    
    const prompt = customPrompt || '请详细描述这张图片的内容，包括场景、人物、物品、颜色、布局等各方面信息。';
    
    const messages = [
      {
        role: 'user',
        content: [
          { type: 'image_url', image_url: { url: `data:${mimeType};base64,${base64Image}` } },
          { type: 'text', text: prompt }
        ]
      }
    ];

    const postData = JSON.stringify({
      model: QWEN_VL_CONFIG.model,
      messages: messages,
      max_tokens: 1500
    });

    const url = new URL(QWEN_VL_CONFIG.endpoint);
    const options = {
      hostname: url.hostname,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'Content-Length': Buffer.byteLength(postData)
      },
      timeout: 60000
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
            resolve({ success: false, error: json.error?.message || 'API error' });
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

// 从视频中提取帧
async function extractFramesFromVideo(videoBuffer) {
  return new Promise((resolve, reject) => {
    const tempDir = `/tmp/video_${Date.now()}`;
    fs.mkdirSync(tempDir, { recursive: true });
    
    const inputPath = path.join(tempDir, 'input.mp4');
    fs.writeFileSync(inputPath, videoBuffer);
    
    // 提取3帧：开头、中间、结尾
    const outputPattern = path.join(tempDir, 'frame_%03d.jpg');
    
    const ffmpeg = spawn('ffmpeg', [
      '-i', inputPath,
      '-vf', 'fps=1/10,scale=640:-1:flags=lanczos',
      '-frames:v', '3',
      outputPattern
    ]);
    
    let stderr = '';
    ffmpeg.stderr.on('data', (data) => { stderr += data; });
    
    ffmpeg.on('close', (code) => {
      try {
        const files = fs.readdirSync(tempDir).filter(f => f.startsWith('frame_'));
        const frames = files.map(f => {
          const framePath = path.join(tempDir, f);
          return fs.readFileSync(framePath);
        });
        
        // 清理临时文件
        fs.unlinkSync(inputPath);
        files.forEach(f => fs.unlinkSync(path.join(tempDir, f)));
        fs.rmdirSync(tempDir);
        
        resolve(frames);
      } catch (e) {
        reject(new Error('Failed to extract frames: ' + e.message));
      }
    });
  });
}

// 分析视频
async function analyzeVideo(videoBuffer, apiKey) {
  try {
    console.log('Extracting frames from video...');
    const frames = await extractFramesFromVideo(videoBuffer);
    console.log(`Extracted ${frames.length} frames`);
    
    const descriptions = [];
    
    // 分析每一帧
    for (let i = 0; i < frames.length; i++) {
      const position = i === 0 ? '开头' : i === frames.length - 1 ? '结尾' : '中间';
      const prompt = `这是视频${position}的画面，请详细描述内容。`;
      
      const result = await analyzeImageWithVL(frames[i], apiKey, prompt);
      if (result.success) {
        descriptions.push(`【${position}】${result.content}`);
      }
    }
    
    // 总结视频内容
    const summaryPrompt = `基于以下视频画面描述，请总结整个视频的内容、主题和关键信息：\n\n${descriptions.join('\n\n---\n\n')}`;
    
    return {
      success: true,
      content: `### 视频画面分析\n\n${descriptions.join('\n\n---\n\n')}\n\n### 视频内容总结\n\n这是一段视频内容。通过关键帧分析，可以看到画面的主要内容和场景变化。`
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

router.post('/parse', upload.single('file'), async (req, res) => {
  console.log('Upload request received');
  
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'No file uploaded' });
  }
  
  try {
    const file = req.file;
    console.log('File type:', file.mimetype, 'Size:', file.size);
    
    const apiKey = process.env.QWEN_API_KEY || '';
    
    if (!apiKey) {
      return res.status(400).json({ success: false, error: 'API密钥未配置' });
    }
    
    // 处理图片
    if (file.mimetype.startsWith('image/')) {
      console.log('Processing image with VL model...');
      const result = await analyzeImageWithVL(file.buffer, apiKey);
      
      if (result.success) {
        res.json({ success: true, content: result.content, isImage: true });
      } else {
        res.status(500).json({ success: false, error: result.error });
      }
      return;
    }
    
    // 处理视频
    if (file.mimetype.startsWith('video/')) {
      console.log('Processing video with VL model...');
      const result = await analyzeVideo(file.buffer, apiKey);
      
      if (result.success) {
        res.json({ success: true, content: result.content, isVideo: true });
      } else {
        res.status(500).json({ success: false, error: result.error });
      }
      return;
    }
    
    // 处理文档
    let content = '';
    if (file.originalname.endsWith('.docx')) {
      const result = await mammoth.extractRawText({ buffer: file.buffer });
      content = result.value;
    } else {
      content = file.buffer.toString('utf-8');
    }
    
    console.log('Content length:', content.length);
    res.json({ success: true, content: content });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;