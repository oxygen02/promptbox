"use client";

import { useState, useEffect } from "react";
import { Star, Download, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const favoritesData = {
  zh: [
    { id: 1, title: "Midjourney 人物肖像", tags: ["肖像", "写实", "高清"] },
    { id: 2, title: "短视频脚本模板", tags: ["脚本", "创意", "热门"] },
    { id: 3, title: "电商详情页设计", tags: ["电商", "转化", "移动端"] },
  ],
  en: [
    { id: 1, title: "Midjourney Portrait", tags: ["portrait", "realistic", "HD"] },
    { id: 2, title: "Video Script Template", tags: ["script", "creative", "popular"] },
    { id: 3, title: "E-commerce Detail Page", tags: ["e-commerce", "conversion", "mobile"] },
  ],
};

export default function FavoritesPage() {
  const [language, setLanguage] = useState<"zh" | "en">("zh");
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    // 优先使用 localStorage 保存的语言偏好
    const savedLang = localStorage.getItem('language');
    if (savedLang === 'zh' || savedLang === 'en') {
      setLanguage(savedLang);
    } else {
      const browserLang = navigator.language?.toLowerCase().startsWith('zh') ? 'zh' : 'en';
      setLanguage(browserLang);
    }
  }, []);
  
  useEffect(() => {
    const handleLanguageChange = (e: any) => {
      setLanguage(e.detail);
    };
    window.addEventListener("language-change", handleLanguageChange);
    return () => window.removeEventListener("language-change", handleLanguageChange);
  }, []);
  const data = favoritesData[language];

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Star className="w-8 h-8 text-slate-700" />
            <h1 className="text-2xl font-bold text-slate-900">
              {language === "zh" ? "模板收藏" : "Favorites"}
            </h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => { const newLang = language === "zh" ? "en" : "zh"; localStorage.setItem("language", newLang); setLanguage(newLang); window.dispatchEvent(new CustomEvent("language-change", { detail: newLang })); }}>
              {language === "zh" ? "EN" : "中文"}
            </Button>
          </div>
        </div>

        {mounted && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.map((item) => (
            <div key={item.id} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
              <h3 className="text-sm font-medium text-slate-900 mb-2">{item.title}</h3>
              <div className="flex flex-wrap gap-1 mb-3">
                {item.tags.map((tag, i) => (
                  <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Download className="w-3 h-3 mr-1" />
                  {language === "zh" ? "下载" : "Download"}
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        )}
      </div>
    </div>
  );
}
