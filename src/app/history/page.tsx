"use client";

import { useState, useEffect } from "react";
import { History, Calendar, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const historyData = {
  zh: [
    { id: 1, title: "AI 写作提示词", date: "2026-03-28", type: "文字" },
    { id: 2, title: "产品展示图", date: "2026-03-27", type: "图片" },
    { id: 3, title: "短视频脚本", date: "2026-03-26", type: "视频" },
    { id: 4, title: "网页设计方案", date: "2026-03-25", type: "网页" },
  ],
  en: [
    { id: 1, title: "AI Writing Prompt", date: "2026-03-28", type: "Text" },
    { id: 2, title: "Product Image", date: "2026-03-27", type: "Image" },
    { id: 3, title: "Short Video Script", date: "2026-03-26", type: "Video" },
    { id: 4, title: "Web Design", date: "2026-03-25", type: "Web" },
  ],
};

export default function HistoryPage() {
  const [language, setLanguage] = useState<"zh" | "en">("zh");
  const [mounted, setMounted] = useState(false);

  // 客户端挂载后检测浏览器语言
  useEffect(() => {
    setMounted(true);
    const savedLang = localStorage.getItem('promptbox-language') as "zh" | "en";
    if (savedLang) {
      setLanguage(savedLang);
    } else {
      const browserLang = navigator.language?.toLowerCase().startsWith('zh') ? 'zh' : 'en';
      setLanguage(browserLang);
    }
  }, []);

  // 监听语言切换事件
  useEffect(() => {
    const handleLanguageChange = (e: any) => {
      setLanguage(e.detail);
    };
    window.addEventListener("language-change", handleLanguageChange);
    return () => window.removeEventListener("language-change", handleLanguageChange);
  }, []);

  if (!mounted) {
    return null;
  }

  const data = historyData[language];

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <History className="w-8 h-8 text-slate-700" />
            <h1 className="text-2xl font-bold text-slate-900">
              {language === "zh" ? "历史记录" : "History"}
            </h1>
          </div>
          <Button variant="outline" onClick={() => { const newLang = language === "zh" ? "en" : "zh"; setLanguage(newLang); localStorage.setItem('promptbox-language', newLang); window.dispatchEvent(new CustomEvent("language-change", { detail: newLang })); }}>
            {language === "zh" ? "EN" : "中文"}
          </Button>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="p-4 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder={language === "zh" ? "搜索历史记录..." : "Search history..."}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-800"
                />
              </div>
              <Button variant="outline" size="sm">
                <Calendar className="w-4 h-4 mr-1" />
                {language === "zh" ? "筛选" : "Filter"}
              </Button>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {data.map((item) => (
              <div key={item.id} className="p-4 hover:bg-slate-50 cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-slate-900">{item.title}</h3>
                    <p className="text-xs text-slate-500 mt-1">{item.date} · {item.type}</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    {language === "zh" ? "查看" : "View"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
