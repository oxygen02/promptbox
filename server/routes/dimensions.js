const express = require('express');
const router = express.Router();

// Mock dimensions data
const DIMENSIONS = {
  text: ['通用创作', 'ChatGPT长文本', 'Claude合规', '核心观点', '文案逻辑', '短视频脚本', 'PPT大纲', '营销转化', '学术润色', '代码文档', '小说续写', '公文模板'],
  image: ['Midjourney', 'DALL-E 3', 'Stable Diffusion', '风格提取', '色彩搭配', '构图光影', '电商商品', '海报文案', '插画创作', '摄影参数', '建筑渲染', 'UI设计'],
  video: ['Pika', 'Runway Gen-4', '可灵AI', '运镜转场', '画面风格', '字幕口播', '剧情脚本', '分镜设计', 'BGM匹配', 'AI剪辑', '特效合成', '动态海报'],
  web: ['V0建站', 'Framer', '结构组件', '设计配色', '交互逻辑', 'React组件', '响应式适配', 'SEO优化', 'Landing Page', '组件库', '后台模板', '电商主题']
};

// Get dimensions by type
router.get('/', (req, res) => {
  const { type } = req.query;
  
  if (type && DIMENSIONS[type]) {
    return res.json({
      success: true,
      type,
      dimensions: DIMENSIONS[type]
    });
  }
  
  res.json({
    success: true,
    types: DIMENSIONS
  });
});

module.exports = router;
