"use client";

import { useState } from "react";
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
        "文章标题生成", "内容润色", "大纲撰写", "结尾总结",
        "SEO文章", "社交媒体", "邮件撰写", "广告文案"
      ] 
    },
    { 
      category: "图像生成", 
      items: [
        "人物肖像", "风景场景", "产品展示", "抽象艺术",
        "Logo设计", "UI界面", "建筑渲染", "动漫风格"
      ] 
    },
    { 
      category: "视频创作", 
      items: [
        "脚本撰写", "分镜设计", "配音稿", "字幕生成",
        "短视频创意", "宣传片", "纪录片", "微电影"
      ] 
    },
    { 
      category: "网页设计", 
      items: [
        "Landing Page", "仪表盘", "移动端页面", "电商详情页",
        "博客主题", "个人主页", "企业官网", "作品集"
      ] 
    },
  ],
  en: [
    { 
      category: "Writing", 
      items: [
        "Title Generator", "Content Polish", "Outline Writer", "Summary",
        "SEO Article", "Social Media", "Email Writing", "Ad Copy"
      ] 
    },
    { 
      category: "Image", 
      items: [
        "Portrait", "Landscape", "Product", "Abstract Art",
        "Logo Design", "UI Interface", "Architectural", "Anime Style"
      ] 
    },
    { 
      category: "Video", 
      items: [
        "Script", "Storyboard", "Voiceover", "Subtitles",
        "Short Video", "Promo Video", "Documentary", "Film"
      ] 
    },
    { 
      category: "Web Design", 
      items: [
        "Landing Page", "Dashboard", "Mobile Page", "E-commerce",
        "Blog Theme", "Personal Portfolio", "Corporate", "Portfolio"
      ] 
    },
  ],
};

export default function TemplatesPage() {
  const [language, setLanguage] = useState<"zh" | "en">("zh");
  const [copied, setCopied] = useState<string | null>(null);
  const t = templates[language];
  const sites = language === "zh" ? chineseSites : englishSites;

  const handleCopy = async (item: string) => {
    await navigator.clipboard.writeText(item);
    setCopied(item);
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
          <Button variant="outline" onClick={() => setLanguage(language === "zh" ? "en" : "zh")}>
            {language === "zh" ? "EN" : "中文"}
          </Button>
        </div>

        {/* 提示词网站推荐 */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            {language === "zh" ? "推荐提示词网站" : "Recommended Prompt Websites"}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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
            <div key={i} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
              <h3 
                className="text-base font-semibold text-slate-900 mb-4 cursor-pointer hover:text-blue-600 flex items-center gap-2"
                onClick={() => {
                  const allItems = cat.items.join('\n');
                  handleCopy(allItems);
                }}
              >
                {cat.category}
                {copied === cat.items.join('\n') && <span className="text-[10px] text-green-500 font-normal">已复制全部</span>}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {cat.items.map((item, j) => (
                  <div 
                    key={j} 
                    onClick={() => handleCopy(item)}
                    className="flex items-center justify-between p-2 bg-slate-50 hover:bg-blue-50 rounded-lg group cursor-pointer border border-transparent hover:border-blue-200 transition-all"
                  >
                    <span className="text-sm text-slate-600 group-hover:text-blue-600 truncate">{item}</span>
                    {copied === item ? (
                      <span className="text-[10px] text-green-500">已复制</span>
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
