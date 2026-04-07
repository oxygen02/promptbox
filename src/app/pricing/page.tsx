"use client";

import { useState, useEffect } from "react";
import { Check, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PricingPage() {
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

  const plans = {
    zh: [
      { name: "免费版", price: "¥0", credits: "50/天", features: ["每日 50 积分", "基础提示词生成", "标准响应速度", "社区支持"], cta: "当前计划" },
      { name: "基础版", price: "¥29", credits: "500", features: ["500 积分", "高级提示词生成", "优先响应速度", "邮件支持", "无广告"], cta: "立即购买" },
      { name: "专业版", price: "¥99", credits: "2000", features: ["2000 积分", "专属AI模型", "最快响应速度", "优先客服", "API访问", "批量处理"], cta: "立即购买" },
      { name: "企业版", price: "¥399", credits: "10000", features: ["10000 积分", "定制模型", "专属客服", "无限协作", "私有部署", "SLA保障"], cta: "联系我们" },
    ],
    en: [
      { name: "Free", price: "$0", credits: "50/day", features: ["50 credits daily", "Basic prompt generation", "Standard speed", "Community support"], cta: "Current Plan" },
      { name: "Basic", price: "$9", credits: "500", features: ["500 credits", "Advanced prompts", "Priority speed", "Email support", "No ads"], cta: "Buy Now" },
      { name: "Pro", price: "$29", credits: "2000", features: ["2000 credits", "Exclusive models", "Fastest speed", "Priority support", "API access", "Batch processing"], cta: "Buy Now" },
      { name: "Enterprise", price: "$99", credits: "10000", features: ["10000 credits", "Custom models", "Dedicated support", "Unlimited collaboration", "Private deployment", "SLA guarantee"], cta: "Contact Us" },
    ],
  };

  const handleLanguageToggle = () => {
    const newLang = language === "zh" ? "en" : "zh";
    setLanguage(newLang);
    window.dispatchEvent(new CustomEvent("language-change", { detail: newLang }));
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <Button variant="outline" onClick={handleLanguageToggle}>
            {language === "zh" ? "Switch to English" : "切换到中文"}
          </Button>
          <h1 className="text-4xl font-bold text-slate-900 mt-6 mb-2">
            {language === "zh" ? "定价方案" : "Pricing Plans"}
          </h1>
          <p className="text-lg text-slate-600">
            {language === "zh" ? "选择适合您的计划，开始 AI 创作之旅" : "Choose the plan that fits you and start your AI creative journey"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans[language].map((plan, index) => (
            <div 
              key={index} 
              className={`bg-white rounded-2xl border p-6 shadow-sm ${
                index === 0 ? 'border-slate-200' : 'border-blue-200 relative'
              }`}
            >
              {index !== 0 && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs px-3 py-1 rounded-full">
                  {language === "zh" ? "热门" : "Popular"}
                </div>
              )}
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-3xl font-bold text-slate-900">{plan.price}</span>
                </div>
                <p className="text-sm text-slate-500 mt-1">{plan.credits}</p>
              </div>
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-center gap-2 text-sm text-slate-600">
                    <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button 
                className="w-full" 
                variant={index === 0 ? "outline" : "default"}
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-slate-500 flex items-center justify-center gap-2">
            <Zap className="w-5 h-5" />
            {language === "zh" ? "所有计划都支持随时取消" : "All plans support cancellation anytime"}
          </p>
        </div>
      </div>
    </div>
  );
}