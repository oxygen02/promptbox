"use client";

import { useState, useEffect } from "react";
import { User, Bell, Lock, Globe, Palette, CreditCard, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const [language, setLanguage] = useState<"zh" | "en">("zh");
  const [mounted, setMounted] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  // 客户端挂载后检测浏览器语言
  useEffect(() => {
    setMounted(true);
    const savedLang = localStorage.getItem('language');
    if (savedLang === 'zh' || savedLang === 'en') {
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

  const toggleLanguage = () => {
    const newLang = language === "zh" ? "en" : "zh";
    localStorage.setItem("language", newLang);
    setLanguage(newLang);
    window.dispatchEvent(new CustomEvent("language-change", { detail: newLang }));
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-slate-900">
            {language === "zh" ? "设置" : "Settings"}
          </h1>
          <Button variant="outline" onClick={toggleLanguage}>
            {language === "zh" ? "EN" : "中文"}
          </Button>
        </div>

        {/* Account */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden mb-4">
          <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 border-b border-slate-200">
            <User className="w-5 h-5 text-slate-600" />
            <h2 className="font-medium text-slate-900">{language === "zh" ? "账户信息" : "Account"}</h2>
          </div>
          <div className="divide-y divide-slate-100">
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-sm text-slate-600">{language === "zh" ? "用户名" : "Username"}</span>
              <span className="text-sm text-slate-700">Oliver</span>
            </div>
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-sm text-slate-600">{language === "zh" ? "邮箱" : "Email"}</span>
              <span className="text-sm text-slate-700">oygq1983@icloud.com</span>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden mb-4">
          <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 border-b border-slate-200">
            <Bell className="w-5 h-5 text-slate-600" />
            <h2 className="font-medium text-slate-900">{language === "zh" ? "通知设置" : "Notifications"}</h2>
          </div>
          <div className="divide-y divide-slate-100">
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-sm text-slate-600">{language === "zh" ? "邮件通知" : "Email Notifications"}</span>
              <button
                onClick={() => setNotifications(!notifications)}
                className={`w-11 h-6 rounded-full transition-colors ${notifications ? "bg-slate-800" : "bg-slate-200"}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${notifications ? "translate-x-5" : "translate-x-0.5"}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Appearance */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden mb-4">
          <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 border-b border-slate-200">
            <Palette className="w-5 h-5 text-slate-600" />
            <h2 className="font-medium text-slate-900">{language === "zh" ? "外观" : "Appearance"}</h2>
          </div>
          <div className="divide-y divide-slate-100">
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-sm text-slate-600">{language === "zh" ? "深色模式" : "Dark Mode"}</span>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`w-11 h-6 rounded-full transition-colors ${darkMode ? "bg-slate-800" : "bg-slate-200"}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${darkMode ? "translate-x-5" : "translate-x-0.5"}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Logout */}
        <Button variant="outline" className="w-full text-red-500 border-red-200 hover:bg-red-50">
          {language === "zh" ? "退出登录" : "Log Out"}
        </Button>
      </div>
    </div>
  );
}