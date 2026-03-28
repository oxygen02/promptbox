"use client";

import { useState } from "react";
import { Link2, ExternalLink } from "lucide-react";

const tools = {
  zh: [
    { name: "Midjourney", desc: "AI 图像生成", url: "https://www.midjourney.com" },
    { name: "DALL-E", desc: "OpenAI 图像生成", url: "https://openai.com/dall-e-3" },
    { name: "Runway", desc: "AI 视频生成", url: "https://runwayml.com" },
    { name: "Stable Diffusion", desc: "开源图像生成", url: "https://stability.ai" },
    { name: "Kimi", desc: "AI 写作助手", url: "https://kimi.moonshot.cn" },
    { name: "通义千问", desc: "阿里云 AI", url: "https://tongyi.aliyun.com" },
  ],
  en: [
    { name: "Midjourney", desc: "AI Image Generation", url: "https://www.midjourney.com" },
    { name: "DALL-E", desc: "OpenAI Image Generation", url: "https://openai.com/dall-e-3" },
    { name: "Runway", desc: "AI Video Generation", url: "https://runwayml.com" },
    { name: "Stable Diffusion", desc: "Open Source Image", url: "https://stability.ai" },
    { name: "Kimi", desc: "AI Writing Assistant", url: "https://kimi.moonshot.cn" },
    { name: "Tongyi Qianwen", desc: "Aliyun AI", url: "https://tongyi.aliyun.com" },
  ],
};

export default function ToolsPage() {
  const [language, setLanguage] = useState<"zh" | "en">("zh");

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Link2 className="w-8 h-8 text-slate-700" />
            <h1 className="text-2xl font-bold text-slate-900">
              {language === "zh" ? "创作推荐网站" : "Creative Tools"}
            </h1>
          </div>
          <button
            onClick={() => setLanguage(language === "zh" ? "en" : "zh")}
            className="text-sm text-slate-500 hover:text-slate-700"
          >
            {language === "zh" ? "Switch to English" : "切换到中文"}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tools[language].map((tool, i) => (
            <a
              key={i}
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md hover:border-slate-300 transition-all group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold text-slate-900 group-hover:text-blue-600">{tool.name}</h3>
                  <p className="text-sm text-slate-500">{tool.desc}</p>
                </div>
                <ExternalLink className="w-5 h-5 text-slate-400 group-hover:text-blue-500" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
