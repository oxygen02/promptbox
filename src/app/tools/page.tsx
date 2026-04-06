"use client";

import { useState, useEffect } from "react";
import { Globe, Image, Video, FileText, Layout, Monitor, Film, ExternalLink } from "lucide-react";

// AI创作工具分类数据
const toolCategories = {
  zh: [
    {
      category: "文生文",
      icon: FileText,
      tools: [
        { name: "ChatGPT", url: "https://chatgpt.com", desc: "OpenAI的AI对话助手", tags: ["对话", "写作"] },
        { name: "Claude", url: "https://claude.ai", desc: "Anthropic的AI助手，擅长长文本", tags: ["长文本", "分析"] },
        { name: "文心一言", url: "https://yiyan.baidu.com", desc: "百度的AI对话产品", tags: ["中文", "搜索"] },
        { name: "通义千问", url: "https://tongyi.aliyun.com", desc: "阿里云的AI大模型", tags: ["中文", "代码"] },
        { name: "智谱清言", url: "https://chatglm.cn", desc: "清华团队的ChatGLM", tags: ["中文", "学术"] },
        { name: "Kimi", url: "https://kimi.moonshot.cn", desc: "月之暗面的长文本AI", tags: ["长文本", "阅读"] },
        { name: "讯飞星火", url: "https://xinghuo.xfyun.cn", desc: "科大讯飞的AI助手", tags: ["语音", "办公"] },
        { name: "豆包", url: "https://www.doubao.com", desc: "字节跳动的AI助手", tags: ["多模态", "创意"] },
        { name: "DeepSeek", url: "https://chat.deepseek.com", desc: "深度求索的AI助手", tags: ["代码", "推理"] },
        { name: "Gemini", url: "https://gemini.google.com", desc: "Google的AI助手", tags: ["多语言", "搜索"] },
      ]
    },
    {
      category: "文生图",
      icon: Image,
      tools: [
        { name: "Midjourney", url: "https://www.midjourney.com", desc: "顶级AI绘画工具", tags: ["艺术", "设计"] },
        { name: "Stable Diffusion", url: "https://stability.ai", desc: "开源AI绘画模型", tags: ["开源", "本地"] },
        { name: "DALL·E 3", url: "https://openai.com/dall-e-3", desc: "OpenAI的图像生成", tags: ["高清", "精准"] },
        { name: "即梦AI", url: "https://jimeng.jianying.com", desc: "剪映旗下的AI绘画", tags: ["中文", "抖音"] },
        { name: "通义万相", url: "https://tongyi.aliyun.com/wanxiang", desc: "阿里的AI绘画", tags: ["中文", "艺术"] },
        { name: "文心一格", url: "https://yige.baidu.com", desc: "百度的AI绘画平台", tags: ["中文", "国风"] },
        { name: "LiblibAI", url: "https://www.liblib.art", desc: "国内AI绘画社区", tags: ["社区", "模型"] },
        { name: "无界AI", url: "https://www.wujieai.com", desc: "国产AI绘画平台", tags: ["中文", "商用"] },
        { name: "通绘", url: "https://tonghui.tongyi.aliyun.com", desc: "通义万相的绘画工具", tags: ["中文", "设计"] },
        { name: "Playground", url: "https://playgroundai.com", desc: "免费AI绘画工具", tags: ["免费", "易用"] },
      ]
    },
    {
      category: "文生视频",
      icon: Video,
      tools: [
        { name: "Sora", url: "https://openai.com/sora", desc: "OpenAI的视频生成模型", tags: ["高清", "长视频"] },
        { name: "Runway", url: "https://runwayml.com", desc: "专业AI视频工具", tags: ["专业", "特效"] },
        { name: "Pika", url: "https://pika.art", desc: "AI视频生成平台", tags: ["创意", "动画"] },
        { name: "可灵AI", url: "https://klingai.kuaishou.com", desc: "快手的AI视频", tags: ["中文", "短视频"] },
        { name: "即梦AI视频", url: "https://jimeng.jianying.com", desc: "剪映的AI视频", tags: ["中文", "抖音"] },
        { name: "Vidu", url: "https://www.vidu.com", desc: "生数科技的AI视频", tags: ["中文", "高效"] },
        { name: "海螺AI", url: "https://hailuoai.video", desc: "MiniMax的视频生成", tags: ["中文", "创意"] },
        { name: "Morph Studio", url: "https://www.morphstudio.com", desc: "AI视频制作平台", tags: ["电影", "专业"] },
        { name: "PixVerse", url: "https://pixverse.ai", desc: "免费AI视频工具", tags: ["免费", "易用"] },
        { name: "Luma Dream Machine", url: "https://lumalabs.ai/dream-machine", desc: "Luma的AI视频", tags: ["3D", "真实"] },
      ]
    },
    {
      category: "图生图",
      icon: Layout,
      tools: [
        { name: "Photoshop AI", url: "https://www.adobe.com/products/photoshop", desc: "Adobe的AI修图", tags: ["专业", "设计"] },
        { name: "Remove.bg", url: "https://www.remove.bg", desc: "自动抠图工具", tags: ["抠图", "快捷"] },
        { name: "Upscale.media", url: "https://www.upscale.media", desc: "AI图片放大", tags: ["放大", "清晰"] },
        { name: "美图秀秀AI", url: "https://pc.meitu.com", desc: "美图的AI功能", tags: ["美颜", "人像"] },
        { name: "佐糖", url: "https://picwish.cn", desc: "在线图片处理", tags: ["去水印", "修复"] },
        { name: "Bigjpg", url: "https://bigjpg.com", desc: "动漫图片放大", tags: ["动漫", "放大"] },
        { name: "Let's Enhance", url: "https://letsenhance.io", desc: "AI图片增强", tags: ["增强", "细节"] },
        { name: "Nero AI", url: "https://neroai.com", desc: "AI图片处理工具", tags: ["老照片", "修复"] },
        { name: "VanceAI", url: "https://vanceai.com", desc: "多功能AI图片工具", tags: ["多功能", "批量"] },
        { name: "Cutout.pro", url: "https://www.cutout.pro", desc: "AI图像处理平台", tags: ["抠图", "卡通化"] },
      ]
    },
    {
      category: "图生视频",
      icon: Film,
      tools: [
        { name: "Runway Gen-2", url: "https://runwayml.com", desc: "图片转视频", tags: ["专业", "电影"] },
        { name: "Pika 1.0", url: "https://pika.art", desc: "图生视频工具", tags: ["创意", "动画"] },
        { name: "Stable Video", url: "https://www.stablevideo.com", desc: "Stability的图生视频", tags: ["开源", "稳定"] },
        { name: "可灵AI图生视频", url: "https://klingai.kuaishou.com", desc: "快手的图生视频", tags: ["中文", "流畅"] },
        { name: "即梦AI图生视频", url: "https://jimeng.jianying.com", desc: "剪映图生视频", tags: ["中文", "简单"] },
        { name: "LeiaPix", url: "https://www.leiapix.com", desc: "2D转3D视频", tags: ["3D", "立体"] },
        { name: "Kaiber", url: "https://kaiber.ai", desc: "AI视频生成平台", tags: ["音乐", "艺术"] },
        { name: "D-ID", url: "https://www.d-id.com", desc: "照片转说话视频", tags: ["数字人", "演讲"] },
        { name: "HeyGen", url: "https://www.heygen.com", desc: "AI数字人视频", tags: ["数字人", "多语言"] },
        { name: "Synthesia", url: "https://www.synthesia.io", desc: "企业级AI视频", tags: ["企业", "培训"] },
      ]
    },
    {
      category: "视频生视频",
      icon: Monitor,
      tools: [
        { name: "Runway", url: "https://runwayml.com", desc: "AI视频编辑", tags: ["专业", "特效"] },
        { name: "Descript", url: "https://www.descript.com", desc: "AI视频剪辑", tags: ["剪辑", "字幕"] },
        { name: "CapCut", url: "https://www.capcut.com", desc: "剪映国际版", tags: ["免费", "易用"] },
        { name: "Wondershare Filmora", url: "https://filmora.wondershare.com", desc: "万兴喵影AI", tags: ["国产", "功能全"] },
        { name: "Adobe Premiere Pro", url: "https://www.adobe.com/products/premiere", desc: "专业视频剪辑", tags: ["专业", "行业标准"] },
        { name: "Topaz Video AI", url: "https://www.topazlabs.com/topaz-video-ai", desc: "AI视频增强", tags: ["增强", "修复"] },
        { name: "Wisecut", url: "https://www.wisecut.video", desc: "AI自动剪辑", tags: ["自动", "短视频"] },
        { name: "OpusClip", url: "https://www.opus.pro", desc: "长视频转短视频", tags: [" repurposing", "病毒式"] },
        { name: "Unscreen", url: "https://www.unscreen.com", desc: "AI去背景", tags: ["去背景", "透明"] },
        { name: "Pictory", url: "https://pictory.ai", desc: "文字转视频", tags: ["营销", "快速"] },
      ]
    },
    {
      category: "文生网站",
      icon: Globe,
      tools: [
        { name: "Framer", url: "https://www.framer.com", desc: "AI网站设计工具", tags: ["设计", "专业"] },
        { name: "Wix ADI", url: "https://www.wix.com/adi", desc: "Wix的AI建站", tags: ["模板", "商务"] },
        { name: "Durable", url: "https://durable.co", desc: "30秒生成网站", tags: ["快速", "简单"] },
        { name: "10Web", url: "https://10web.io", desc: "AI WordPress建站", tags: ["WordPress", "电商"] },
        { name: "TeleportHQ", url: "https://teleporthq.io", desc: "AI前端开发", tags: ["代码", "前端"] },
        { name: "SiteKick", url: "https://sitekick.ai", desc: "AI落地页生成", tags: ["落地页", "营销"] },
        { name: "Softr", url: "https://www.softr.io", desc: "无代码AI建站", tags: ["无代码", "应用"] },
        { name: "Vercel v0", url: "https://v0.dev", desc: "Vercel的AI生成UI", tags: ["开发", "React"] },
        { name: "Replit Agent", url: "https://replit.com", desc: "AI编程助手", tags: ["编程", "全栈"] },
        { name: "Figma AI", url: "https://www.figma.com/ai", desc: "Figma的AI设计", tags: ["设计", "协作"] },
      ]
    },
  ],
  en: [
    {
      category: "Text to Text",
      icon: FileText,
      tools: [
        { name: "ChatGPT", url: "https://chatgpt.com", desc: "OpenAI's conversational AI", tags: ["Chat", "Writing"] },
        { name: "Claude", url: "https://claude.ai", desc: "Anthropic's AI assistant", tags: ["Long-form", "Analysis"] },
        { name: "Gemini", url: "https://gemini.google.com", desc: "Google's AI assistant", tags: ["Multilingual", "Search"] },
        { name: "Perplexity", url: "https://www.perplexity.ai", desc: "AI search engine", tags: ["Research", "Citations"] },
        { name: "Jasper", url: "https://www.jasper.ai", desc: "AI writing for marketing", tags: ["Marketing", "SEO"] },
        { name: "Copy.ai", url: "https://www.copy.ai", desc: "AI copywriting tool", tags: ["Copy", "Ads"] },
        { name: "Notion AI", url: "https://www.notion.so/product/ai", desc: "AI for productivity", tags: ["Productivity", "Notes"] },
        { name: "Grammarly", url: "https://www.grammarly.com", desc: "AI writing assistant", tags: ["Grammar", "Editing"] },
        { name: "Writesonic", url: "https://writesonic.com", desc: "AI content creation", tags: ["Blog", "Ecommerce"] },
        { name: "Rytr", url: "https://rytr.me", desc: "AI writing tool", tags: ["Affordable", "Fast"] },
      ]
    },
    {
      category: "Text to Image",
      icon: Image,
      tools: [
        { name: "Midjourney", url: "https://www.midjourney.com", desc: "Top AI art generator", tags: ["Art", "Design"] },
        { name: "DALL·E 3", url: "https://openai.com/dall-e-3", desc: "OpenAI's image model", tags: ["High-quality", "Precise"] },
        { name: "Stable Diffusion", url: "https://stability.ai", desc: "Open-source AI art", tags: ["Open-source", "Local"] },
        { name: "Adobe Firefly", url: "https://www.adobe.com/products/firefly", desc: "Adobe's AI image tool", tags: ["Commercial", "Safe"] },
        { name: "Leonardo.ai", url: "https://leonardo.ai", desc: "AI art for gaming", tags: ["Gaming", "Assets"] },
        { name: "Ideogram", url: "https://ideogram.ai", desc: "AI with text rendering", tags: ["Text", "Typography"] },
        { name: "Playground", url: "https://playgroundai.com", desc: "Free AI image tool", tags: ["Free", "Easy"] },
        { name: "Bing Image Creator", url: "https://www.bing.com/create", desc: "Microsoft's DALL·E", tags: ["Free", "Microsoft"] },
        { name: "NightCafe", url: "https://creator.nightcafe.studio", desc: "AI art community", tags: ["Community", "Styles"] },
        { name: "Artbreeder", url: "https://www.artbreeder.com", desc: "Collaborative AI art", tags: ["Mix", "Portraits"] },
      ]
    },
    {
      category: "Text to Video",
      icon: Video,
      tools: [
        { name: "Sora", url: "https://openai.com/sora", desc: "OpenAI's video model", tags: ["High-quality", "Long-form"] },
        { name: "Runway Gen-3", url: "https://runwayml.com", desc: "Professional AI video", tags: ["Professional", "Effects"] },
        { name: "Pika", url: "https://pika.art", desc: "AI video platform", tags: ["Creative", "Animation"] },
        { name: "Luma Dream Machine", url: "https://lumalabs.ai/dream-machine", desc: "Fast AI video", tags: ["Fast", "Realistic"] },
        { name: "Kling AI", url: "https://klingai.com", desc: "High-quality AI video", tags: ["Quality", "Movement"] },
        { name: "Haiper", url: "https://haiper.ai", desc: "Free AI video tool", tags: ["Free", "Simple"] },
        { name: "Morph Studio", url: "https://www.morphstudio.com", desc: "AI filmmaking", tags: ["Cinema", "Story"] },
        { name: "PixVerse", url: "https://pixverse.ai", desc: "Free AI video tool", tags: ["Free", "Easy"] },
        { name: "Stable Video", url: "https://www.stablevideo.com", desc: "Stability's video AI", tags: ["Open", "Stable"] },
        { name: "Synthesia", url: "https://www.synthesia.io", desc: "AI video avatars", tags: ["Business", "Training"] },
      ]
    },
    {
      category: "Image to Image",
      icon: Layout,
      tools: [
        { name: "Photoshop AI", url: "https://www.adobe.com/products/photoshop", desc: "Adobe's AI editing", tags: ["Pro", "Design"] },
        { name: "Remove.bg", url: "https://www.remove.bg", desc: "Auto background removal", tags: ["Remove", "Fast"] },
        { name: "Topaz Gigapixel", url: "https://www.topazlabs.com/gigapixel-ai", desc: "AI image upscaling", tags: ["Upscale", "Detail"] },
        { name: "Let's Enhance", url: "https://letsenhance.io", desc: "AI image enhancement", tags: ["Enhance", "Print"] },
        { name: "Clipdrop", url: "https://clipdrop.co", desc: "Stability's tools", tags: ["Suite", "Cleanup"] },
        { name: "VanceAI", url: "https://vanceai.com", desc: "AI photo enhancer", tags: ["Photo", "Enhance"] },
        { name: "Cutout.pro", url: "https://www.cutout.pro", desc: "AI image editing", tags: ["Cutout", "Cartoon"] },
        { name: "Photoroom", url: "https://www.photoroom.com", desc: "AI photo studio", tags: ["Product", "E-commerce"] },
        { name: "Fotor", url: "https://www.fotor.com", desc: "AI photo editor", tags: ["Editor", "Design"] },
        { name: "Picsart", url: "https://picsart.com", desc: "AI creative platform", tags: ["Creative", "Social"] },
      ]
    },
    {
      category: "Image to Video",
      icon: Film,
      tools: [
        { name: "Runway Gen-2", url: "https://runwayml.com", desc: "Image to video AI", tags: ["Pro", "Cinematic"] },
        { name: "Pika 1.0", url: "https://pika.art", desc: "Img to video tool", tags: ["Creative", "Animate"] },
        { name: "Stable Video", url: "https://www.stablevideo.com", desc: "Stability video AI", tags: ["Stable", "Open"] },
        { name: "LeiaPix", url: "https://www.leiapix.com", desc: "2D to 3D video", tags: ["3D", "Depth"] },
        { name: "Kaiber", url: "https://kaiber.ai", desc: "AI video platform", tags: ["Music", "Art"] },
        { name: "D-ID", url: "https://www.d-id.com", desc: "Talking head video", tags: ["Avatar", "Speaking"] },
        { name: "HeyGen", url: "https://www.heygen.com", desc: "AI avatar video", tags: ["Avatar", "Multilingual"] },
        { name: "Synthesia", url: "https://www.synthesia.io", desc: "Enterprise AI video", tags: ["Enterprise", "Training"] },
        { name: "Colossyan", url: "https://www.colossyan.com", desc: "AI video creation", tags: ["Learning", "Corporate"] },
        { name: "Elai.io", url: "https://elai.io", desc: "AI video from text", tags: ["Text", "Presentations"] },
      ]
    },
    {
      category: "Video to Video",
      icon: Monitor,
      tools: [
        { name: "Runway", url: "https://runwayml.com", desc: "AI video editing", tags: ["Pro", "Effects"] },
        { name: "Descript", url: "https://www.descript.com", desc: "AI video editing", tags: ["Edit", "Transcribe"] },
        { name: "Adobe Premiere Pro", url: "https://www.adobe.com/products/premiere", desc: "Pro video editor", tags: ["Industry", "Pro"] },
        { name: "DaVinci Resolve", url: "https://www.blackmagicdesign.com/products/davinciresolve", desc: "Free pro editor", tags: ["Free", "Color"] },
        { name: "CapCut", url: "https://www.capcut.com", desc: "Free AI editor", tags: ["Free", "Mobile"] },
        { name: "Topaz Video AI", url: "https://www.topazlabs.com/topaz-video-ai", desc: "AI video enhance", tags: ["Enhance", "Upscale"] },
        { name: "OpusClip", url: "https://www.opus.pro", desc: "Long to short video", tags: ["Viral", "Shorts"] },
        { name: "Wisecut", url: "https://www.wisecut.video", desc: "Auto video editing", tags: ["Auto", "Short-form"] },
        { name: "Unscreen", url: "https://www.unscreen.com", desc: "Remove video bg", tags: ["Background", "Transparent"] },
        { name: "Munch", url: "https://www.getmunch.com", desc: "Repurpose content", tags: ["Repurpose", "Social"] },
      ]
    },
    {
      category: "Text to Website",
      icon: Globe,
      tools: [
        { name: "Framer", url: "https://www.framer.com", desc: "AI website builder", tags: ["Design", "Pro"] },
        { name: "Wix ADI", url: "https://www.wix.com/adi", desc: "Wix AI builder", tags: ["Template", "Business"] },
        { name: "Webflow", url: "https://webflow.com", desc: "No-code web design", tags: ["No-code", "Design"] },
        { name: "Durable", url: "https://durable.co", desc: "30-sec AI websites", tags: ["Fast", "Simple"] },
        { name: "10Web", url: "https://10web.io", desc: "AI WordPress builder", tags: ["WordPress", "E-commerce"] },
        { name: "Softr", url: "https://www.softr.io", desc: "No-code AI builder", tags: ["No-code", "Apps"] },
        { name: "Bubble", url: "https://bubble.io", desc: "Full-stack no-code", tags: ["Full-stack", "Complex"] },
        { name: "Vercel v0", url: "https://v0.dev", desc: "Vercel's AI UI", tags: ["Dev", "React"] },
        { name: "Replit", url: "https://replit.com", desc: "AI coding assistant", tags: ["Code", "Full-stack"] },
        { name: "Typedream", url: "https://typedream.com", desc: "Simple AI websites", tags: ["Simple", "Notion"] },
      ]
    },
  ],
};

export default function ToolsPage() {
  // 默认中文，避免 SSR hydration mismatch
  const [language, setLanguage] = useState<"zh" | "en">("zh");
  const [mounted, setMounted] = useState(false);
  
  // 客户端挂载后检测浏览器语言
  useEffect(() => {
    setMounted(true);
    const browserLang = navigator.language?.toLowerCase().startsWith('zh') ? 'zh' : 'en';
    setLanguage(browserLang);
  }, []);
  
  // 监听语言切换事件
  useEffect(() => {
    const handleLanguageChange = (e: any) => {
      setLanguage(e.detail);
    };
    window.addEventListener("language-change", handleLanguageChange);
    return () => window.removeEventListener("language-change", handleLanguageChange);
  }, []);
  
  const categories = toolCategories[language];

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {language === "zh" ? "创作推荐网站" : "Creative AI Tools"}
            </h1>
            <p className="text-slate-500 mt-1">
              {language === "zh" ? "7大类别 × 10个精选工具" : "7 Categories × 10 Curated Tools"}
            </p>
          </div>
          <button 
            onClick={() => { const newLang = language === "zh" ? "en" : "zh"; setLanguage(newLang); window.dispatchEvent(new CustomEvent("language-change", { detail: newLang })); }}
            className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50"
          >
            {language === "zh" ? "Switch to EN" : "切换中文"}
          </button>
        </div>

        {/* Prevent hydration mismatch */}
        {mounted && (
          <div className="space-y-4">
            {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <div key={idx} className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                <div className="px-4 py-2 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
                  <Icon className="w-4 h-4 text-slate-600" />
                  <h2 className="text-sm font-semibold text-slate-900">{cat.category}</h2>
                </div>
                <div className="p-3">
                  <div className="grid grid-cols-5 gap-2">
                    {cat.tools.slice(0, 10).map((tool, tIdx) => (
                      <a
                        key={tIdx}
                        href={tool.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group p-2 rounded-lg border border-slate-100 hover:border-blue-400 hover:bg-blue-50/50 transition-all shadow-sm hover:shadow-md"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-medium text-slate-800 text-xs group-hover:text-blue-600 truncate">
                            {tool.name}
                          </h3>
                          <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-blue-500 flex-shrink-0" />
                        </div>
                        <p className="text-[9px] text-slate-500 mb-1.5 line-clamp-2 h-[26px]">{tool.desc}</p>
                        <div className="flex flex-wrap gap-1">
                          {tool.tags.slice(0, 2).map((tag, tagIdx) => (
                            <span 
                              key={tagIdx}
                              className="text-[9px] px-1.5 py-0.5 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 rounded-full border border-blue-100"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        )}
      </div>
    </div>
  );
}
