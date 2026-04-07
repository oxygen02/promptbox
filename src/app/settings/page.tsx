"use client";

import { useState, useEffect } from "react";
import { User, Bell, Lock, Globe, Palette, CreditCard, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const [language, setLanguage] = useState<"zh" | "en">("zh");
  const [mounted, setMounted] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  
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

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-800 rounded-lg">
              <User className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">
              {language === "zh" ? "设置" : "Settings"}
            </h1>
          </div>
        </div>

        <div className="space-y-4">
          {/* Language */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-slate-500" />
                <div>
                  <h3 className="font-medium text-slate-900">{language === "zh" ? "语言" : "Language"}</h3>
                  <p className="text-sm text-slate-500">{language === "zh" ? "选择界面语言" : "Select interface language"}</p>
                </div>
              </div>
              <select 
                value={language}
                onChange={(e) => {
                  const newLang = e.target.value as "zh" | "en";
                  setLanguage(newLang);
                  window.dispatchEvent(new CustomEvent("language-change", { detail: newLang }));
                }}
                className="px-3 py-2 border border-slate-200 rounded-lg text-sm"
              >
                <option value="zh">中文</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-slate-500" />
                <div>
                  <h3 className="font-medium text-slate-900">{language === "zh" ? "通知" : "Notifications"}</h3>
                  <p className="text-sm text-slate-500">{language === "zh" ? "接收新功能和更新通知" : "Receive new features and update notifications"}</p>
                </div>
              </div>
              <button
                onClick={() => setNotifications(!notifications)}
                className={`w-12 h-6 rounded-full transition-colors ${notifications ? 'bg-slate-800' : 'bg-slate-300'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${notifications ? 'translate-x-7' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>

          {/* Dark Mode */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Palette className="w-5 h-5 text-slate-500" />
                <div>
                  <h3 className="font-medium text-slate-900">{language === "zh" ? "深色模式" : "Dark Mode"}</h3>
                  <p className="text-sm text-slate-500">{language === "zh" ? "切换深色主题" : "Switch to dark theme"}</p>
                </div>
              </div>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`w-12 h-6 rounded-full transition-colors ${darkMode ? 'bg-slate-800' : 'bg-slate-300'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${darkMode ? 'translate-x-7' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}