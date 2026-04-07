"use client";

import { useState, useEffect } from "react";
import { Sparkles, Zap, Shield, Users } from "lucide-react";

export default function AboutPage() {
  const [language, setLanguage] = useState<"zh" | "en">("zh");
  const [mounted, setMounted] = useState(false);
  
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

  const content = {
    zh: {
      title: "关于 PromptBox",
      subtitle: "让 AI 提示词更简单",
      description: "PromptBox 是一款 AI 提示词分析与生成工具，帮助用户将任意内容转换为高质量的 AI 提示词，支持二次创作和一键分享。",
      features: [
        { icon: Sparkles, title: "智能分析", desc: "AI 自动识别内容类型，生成精准提示词" },
        { icon: Zap, title: "多模型支持", desc: "集成 DeepSeek、Kimi、MiniMax 等主流 AI 模型" },
        { icon: Shield, title: "安全可靠", desc: "数据加密存储，保护用户隐私" },
        { icon: Users, title: "社区分享", desc: "模板库和社区，分享创意提示词" },
      ],
      contact: "联系我们",
      email: "support@promptbox.ai",
    },
    en: {
      title: "About PromptBox",
      subtitle: "Making AI Prompts Simpler",
      description: "PromptBox is an AI prompt analysis and generation tool that helps users convert any content into high-quality AI prompts, supporting secondary creation and one-click sharing.",
      features: [
        { icon: Sparkles, title: "Smart Analysis", desc: "AI automatically identifies content type and generates precise prompts" },
        { icon: Zap, title: "Multi-Model Support", desc: "Integrates DeepSeek, Kimi, MiniMax and other mainstream AI models" },
        { icon: Shield, title: "Secure & Reliable", desc: "Encrypted data storage to protect user privacy" },
        { icon: Users, title: "Community Sharing", desc: "Template library and community for sharing creative prompts" },
      ],
      contact: "Contact Us",
      email: "support@promptbox.ai",
    },
  };

  const c = content[language];

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <button
            onClick={() => { const newLang = language === "zh" ? "en" : "zh"; setLanguage(newLang); window.dispatchEvent(new CustomEvent("language-change", { detail: newLang })); }}
            className="text-sm text-slate-500 hover:text-slate-700 mb-4"
          >
            {language === "zh" ? "Switch to English" : "切换到中文"}
          </button>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">{c.title}</h1>
          <p className="text-xl text-slate-600">{c.subtitle}</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm mb-8">
          <p className="text-lg text-slate-700 leading-relaxed">{c.description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {c.features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">{feature.title}</h3>
                    <p className="text-slate-600">{feature.desc}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-slate-800 rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">{c.contact}</h2>
          <p className="text-slate-300">{c.email}</p>
        </div>
      </div>
    </div>
  );
}