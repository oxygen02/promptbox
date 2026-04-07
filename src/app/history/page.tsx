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
  const [searchQuery, setSearchQuery] = useState("");
  
  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const urlLang = params.get("lang");
      if (urlLang === "zh" || urlLang === "en") {
        setLanguage(urlLang);
      } else {
        const browserLang = navigator.language?.toLowerCase().startsWith('zh') ? 'zh' : 'en';
        setLanguage(browserLang);
      }
    }
  }, []);
  
  useEffect(() => {
    const handleLanguageChange = (e: any) => {
      setLanguage(e.detail);
    };
    window.addEventListener("language-change", handleLanguageChange);
    return () => window.removeEventListener("language-change", handleLanguageChange);
  }, []);
  
  const data = historyData[language];
  const filteredData = data.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLanguageToggle = () => {
    const newLang = language === "zh" ? "en" : "zh";
    setLanguage(newLang);
    window.dispatchEvent(new CustomEvent("language-change", { detail: newLang }));
  };

  if (!mounted) return null;

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
          <Button variant="outline" size="sm" onClick={handleLanguageToggle}>
            {language === "zh" ? "EN" : "中文"}
          </Button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder={language === "zh" ? "搜索历史记录..." : "Search history..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* History List */}
        <div className="space-y-3">
          {filteredData.map((item) => (
            <div key={item.id} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-slate-900">{item.title}</h3>
                  <p className="text-sm text-slate-500">{item.date} · {item.type}</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                {language === "zh" ? "查看" : "View"}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}