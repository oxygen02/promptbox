"use client";

import { useState, useEffect } from "react";
import { BookOpen, Copy, Star, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

// 国内提示词网站
const chineseSites = [
  { name: "PromptHero", url: "https://promptheroes.cn", desc: "覆盖30+模型，支持中文搜索", category: "综合" },
  { name: "From2045", url: "https://www.2045.tv", desc: "多模态优化引擎，古风场景精准度92%", category: "图像" },
  { name: "65960提示词库", url: "https://www.65960.com", desc: "提供SD完整技术参数", category: "图像" },
  { name: "Midlibrary", url: "https://midlibrary.io", desc: "专注Midjourney风格模板", category: "图像" },
  { name: "PromptoMANIA", url: "https://promptomania.com", desc: "可视化生成器降低门槛", category: "图像" },
  { name: "PromptBase", url: "https://promptbase.com", desc: "提示词交易市场", category: "综合" },
  { name: "SaaSPrompts", url: "https://saasprompts.com", desc: "专注效率与营销模板", category: "写作" },
  { name: "Learning Prompt", url: "https://learningprompt.com", desc: "ChatGPT与Midjourney教程", category: "教程" },
  { name: "ChatGPT Shortcut", url: "https://www.chatgptshortcut.com", desc: "快捷指令提升效率", category: "效率" },
  { name: "AI提示词工具大全", url: "https://gongke.net/categories/ai-prompt-tools", desc: "最新热门AI提示词工具", category: "综合" },
];

// 国际提示词网站
const englishSites = [
  { name: "PromptBase", url: "https://promptbase.com", desc: "270,000+ prompts for ChatGPT, Gemini, Midjourney", category: "Marketplace" },
  { name: "The AI Library", url: "https://www.theailibrary.co", desc: "Tested prompts, templates, and workflows", category: "Library" },
  { name: "The Prompt Index", url: "https://www.thepromptindex.com", desc: "600+ curated AI prompts", category: "Database" },
  { name: "PromptDen", url: "https://promptden.com", desc: "Creative prompts for AI tools", category: "Creative" },
  { name: "OnlyPrompt", url: "https://onlyprompt.io", desc: "500+ curated prompts for content creators", category: "Content" },
  { name: "PromptNest", url: "https://promptnest.blog", desc: "Best prompt collections 2025", category: "Collection" },
  { name: "God of Prompt", url: "https://www.godofprompt.ai", desc: "Unbiased prompt library reviews", category: "Reviews" },
  { name: "TypeBoost", url: "https://www.typeboost.ai/en/blog/ai-prompt-library", desc: "12 Best AI Prompt Library Tools 2025", category: "Blog" },
  { name: "Medium - Prompt Libraries", url: "https://medium.com/towards-agi/the-best-prompt-libraries-you-should-explore-for-your-ai-projects-12f5c8423623", desc: "8 Best Prompt Libraries", category: "Articles" },
  { name: "ChatQuick AI", url: "https://chatquick.co/best-prompt-websites/", desc: "10 Best Prompt Websites 2025", category: "Directory" },
];

// 提示词模板
const templates = {
  zh: [
    { 
      category: "写作助手", 
      items: [
        { name: "文章标题生成", template: "请为以下文章生成5个吸引人的标题：[文章大纲]" },
        { name: "内容润色", template: "请润色以下段落，使其更流畅、专业：[原文]" },
        { name: "大纲撰写", template: "请为[主题]撰写一份详细的文章大纲，包含引言、正文和结论" },
        { name: "结尾总结", template: "请为以下文章撰写一个有力的结尾总结：[文章要点]" },
        { name: "SEO文章", template: "请围绕关键词[关键词]写一篇800字的SEO优化文章" },
        { name: "社交媒体", template: "请为[产品/事件]撰写3条适合微博/小红书发布的文案" },
        { name: "邮件撰写", template: "请写一封正式的商务邮件，主题是：[邮件主题]" },
        { name: "广告文案", template: "请为[产品名称]创作一段吸引人的广告语" }
      ] 
    },
    { 
      category: "图像生成", 
      items: [
        { name: "人物肖像", template: "Portrait of a [gender], [age], [style], soft lighting, 8k, highly detailed --ar 3:4" },
        { name: "风景场景", template: "[Landscape type], [time of day], [weather], [mood], cinematic composition, 8k --ar 16:9" },
        { name: "产品展示", template: "Product photography of [product], clean background, professional lighting, studio setup, 4k" },
        { name: "抽象艺术", template: "Abstract [color scheme] art, [texture], [pattern], modern, minimalist, high resolution" },
        { name: "Logo设计", template: "Logo design for [company], [style], [colors], vector, minimalist, white background" },
        { name: "UI界面", template: "UI design for [app type], [style], [color scheme], clean, modern, Figma style --ar 4:3" },
        { name: "建筑渲染", template: "Architectural rendering of [building type], [style], [materials], photorealistic, 8k" },
        { name: "动漫风格", template: "Anime style [subject], [expression], [background], vibrant colors, detailed, studio ghibli style --ar 3:2" }
      ] 
    },
    { 
      category: "视频创作", 
      items: [
        { name: "脚本撰写", template: "请为[主题]撰写一个60秒短视频脚本，包含开场、内容、结尾" },
        { name: "分镜设计", template: "请为[场景]设计分镜脚本，包含镜头景别、时长、画面描述" },
        { name: "配音稿", template: "请撰写一段[风格]的配音稿，时长约[时间]，主题是[主题]" },
        { name: "字幕生成", template: "请为以下视频内容生成配字幕的时间轴和文本：[视频内容描述]" },
        { name: "短视频创意", template: "请提供3个关于[主题]的短视频创意点子" },
        { name: "宣传片", template: "请为[公司/产品]撰写一分钟宣传片的脚本大纲" },
        { name: "纪录片", template: "请为[主题]纪录片撰写旁白开场白（约100字）" },
        { name: "微电影", template: "请为微电影[题材]设计一个三幕式故事大纲" }
      ] 
    },
    { 
      category: "网页设计", 
      items: [
        { name: "Landing Page", template: "设计一个[产品类型]落地页，包含：首屏、功能介绍、用户评价、CTA按钮" },
        { name: "仪表盘", template: "设计[数据类型]仪表盘界面，需要展示：KPI卡片、趋势图表、数据表格" },
        { name: "移动端页面", template: "设计[应用类型]移动端主页面，iOS风格，底部导航栏" },
        { name: "电商详情页", template: "设计商品详情页结构：图片区、价格区、规格选择、详情描述、购买按钮" },
        { name: "博客主题", template: "设计简洁的个人博客首页，包含：导航、文章列表、侧边栏、页脚" },
        { name: "个人主页", template: "设计创意个人作品集主页，包含：头像、简介、技能、作品展示、联系方式" },
        { name: "企业官网", template: "设计[行业]企业官网首页，包含：banner、关于我们、服务、案例、联系" },
        { name: "作品集", template: "设计设计师作品集页面，瀑布流布局，筛选功能，作品详情弹窗" }
      ] 
    },
  ],
  en: [
    { 
      category: "Writing", 
      items: [
        { name: "Title Generator", template: "Generate 5 catchy headlines for this article: [outline]" },
        { name: "Content Polish", template: "Polish the following paragraph to make it more fluent and professional: [text]" },
        { name: "Outline Writer", template: "Create a detailed outline for an article about [topic]" },
        { name: "Summary", template: "Write a compelling conclusion for this article: [key points]" },
        { name: "SEO Article", template: "Write an 800-word SEO-optimized article targeting the keyword [keyword]" },
        { name: "Social Media", template: "Write 3 social media posts for [product/event] suitable for Twitter/Instagram" },
        { name: "Email Writing", template: "Write a formal business email with the subject: [subject]" },
        { name: "Ad Copy", template: "Create compelling ad copy for [product name]" }
      ] 
    },
    { 
      category: "Image", 
      items: [
        { name: "Portrait", template: "Portrait of a [gender], [age], [style], soft lighting, 8k, highly detailed --ar 3:4" },
        { name: "Landscape", template: "[Landscape type], [time of day], [weather], [mood], cinematic composition, 8k --ar 16:9" },
        { name: "Product", template: "Product photography of [product], clean background, professional lighting, studio setup, 4k" },
        { name: "Abstract Art", template: "Abstract [color scheme] art, [texture], [pattern], modern, minimalist, high resolution" },
        { name: "Logo Design", template: "Logo design for [company], [style], [colors], vector, minimalist, white background" },
        { name: "UI Interface", template: "UI design for [app type], [style], [color scheme], clean, modern, Figma style --ar 4:3" },
        { name: "Architectural", template: "Architectural rendering of [building type], [style], [materials], photorealistic, 8k" },
        { name: "Anime Style", template: "Anime style [subject], [expression], [background], vibrant colors, detailed, studio ghibli style --ar 3:2" }
      ] 
    },
    { 
      category: "Video", 
      items: [
        { name: "Script", template: "Write a 60-second video script about [topic] with hook, content, and CTA" },
        { name: "Storyboard", template: "Create a storyboard for [scene] with shot types, duration, and visual descriptions" },
        { name: "Voiceover", template: "Write a [style] voiceover script for [topic], approximately [duration] long" },
        { name: "Subtitles", template: "Generate subtitle timestamps and text for: [video description]" },
        { name: "Short Video", template: "Provide 3 creative short video ideas for [topic]" },
        { name: "Promo Video", template: "Write a 1-minute promotional video script outline for [company/product]" },
        { name: "Documentary", template: "Write a documentary opening narration (about 100 words) for [topic]" },
        { name: "Film", template: "Design a three-act story outline for a [genre] short film" }
      ] 
    },
    { 
      category: "Web Design", 
      items: [
        { name: "Landing Page", template: "Design a [product] landing page with: hero, features, testimonials, CTA" },
        { name: "Dashboard", template: "Design a [data type] dashboard with: KPI cards, trend charts, data tables" },
        { name: "Mobile Page", template: "Design a mobile homepage for [app type], iOS style, bottom navigation" },
        { name: "E-commerce", template: "Design product detail page: image gallery, pricing, variants, description, buy button" },
        { name: "Blog Theme", template: "Design a clean personal blog homepage: nav, article list, sidebar, footer" },
        { name: "Personal Portfolio", template: "Design a creative portfolio homepage: avatar, bio, skills, projects, contact" },
        { name: "Corporate", template: "Design a corporate homepage for [industry]: banner, about, services, cases, contact" },
        { name: "Portfolio", template: "Design a designer portfolio with masonry layout, filter, project detail modal" }
      ] 
    },
  ],
};

export default function TemplatesPage() {
  // 默认中文，避免 SSR hydration mismatch
  const [language, setLanguage] = useState<"zh" | "en">("zh");
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  
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
  
  const t = templates[language];
  const sites = language === "zh" ? chineseSites : englishSites;

  const handleCopy = async (template: string) => {
    await navigator.clipboard.writeText(template);
    setCopied(template);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-slate-700" />
            <h1 className="text-2xl font-bold text-slate-900">
              {language === "zh" ? "提示词模板库" : "Prompt Templates"}
            </h1>
          </div>
          <Button variant="outline" onClick={() => { const newLang = language === "zh" ? "en" : "zh"; setLanguage(newLang); window.dispatchEvent(new CustomEvent("language-change", { detail: newLang })); }}>
            {language === "zh" ? "EN" : "中文"}
          </Button>
        </div>

        {/* Prevent hydration mismatch by not rendering content-dependent UI until mounted */}
        {mounted && (
          <>
        {/* 提示词网站推荐 */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            {language === "zh" ? "推荐提示词网站" : "Recommended Prompt Websites"}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {sites.map((site, i) => (
              <a 
                key={i} 
                href={site.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-lg border border-slate-200 p-4 hover:border-blue-400 hover:shadow-md transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-slate-900 group-hover:text-blue-600">{site.name}</h3>
                    <p className="text-sm text-slate-500">{site.desc}</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-blue-500" />
                </div>
                <span className="inline-block mt-2 text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                  {site.category}
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* 提示词模板 */}
        <div className="space-y-4">
          {t.map((cat, i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
              <h3 
                className="text-sm font-semibold text-slate-800 mb-3 cursor-pointer hover:text-blue-600 flex items-center gap-2"
                onClick={() => {
                  const allTemplates = cat.items.map(item => item.template).join('\n\n---\n\n');
                  handleCopy(allTemplates);
                }}
              >
                {cat.category}
                <span className="text-xs text-slate-400 font-normal">(点击复制全部)</span>
              </h3>
              <div className="grid grid-cols-5 gap-2">
                {cat.items.map((item, j) => (
                  <div 
                    key={j} 
                    onClick={() => handleCopy(item.template)}
                    className="group p-2.5 rounded-lg bg-gradient-to-br from-white to-slate-50 hover:from-blue-50 hover:to-indigo-50 border border-slate-100 hover:border-blue-300 cursor-pointer transition-all shadow-sm hover:shadow-md"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-slate-700 group-hover:text-blue-700 truncate">{item.name}</span>
                      <Copy className="w-3 h-3 text-slate-300 group-hover:text-blue-500 flex-shrink-0" />
                    </div>
                    {copied === item.template && (
                      <span className="text-[9px] text-green-600 font-medium">已复制!</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
          </>
        )}
      </div>
    </div>
  );
}
