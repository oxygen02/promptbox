"use client";

import { useState } from "react";
import { BookOpen, Copy, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const templates = {
  zh: [
    { category: "写作助手", items: ["文章标题生成", "内容润色", "大纲撰写", "结尾总结"] },
    { category: "图像生成", items: ["人物肖像", "风景场景", "产品展示", "抽象艺术"] },
    { category: "视频创作", items: ["脚本撰写", "分镜设计", "配音稿", "字幕生成"] },
    { category: "网页设计", items: [" Landing Page", "仪表盘", "移动端页面", "电商详情页"] },
  ],
  en: [
    { category: "Writing", items: ["Title Generator", "Content Polish", "Outline Writer", "Summary"] },
    { category: "Image", items: ["Portrait", "Landscape", "Product", "Abstract Art"] },
    { category: "Video", items: ["Script", "Storyboard", "Voiceover", "Subtitles"] },
    { category: "Web Design", items: ["Landing Page", "Dashboard", "Mobile", "E-commerce"] },
  ],
};

export default function TemplatesPage() {
  const [language, setLanguage] = useState<"zh" | "en">("zh");
  const t = templates[language];

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {t.map((cat, i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
              <h3 className="text-base font-semibold text-slate-900 mb-4">{cat.category}</h3>
              <div className="space-y-2">
                {cat.items.map((item, j) => (
                  <div key={j} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg group">
                    <span className="text-sm text-slate-600">{item}</span>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 hover:bg-slate-200 rounded"><Copy className="w-4 h-4 text-slate-500" /></button>
                      <button className="p-1.5 hover:bg-slate-200 rounded"><Star className="w-4 h-4 text-slate-500" /></button>
                    </div>
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
