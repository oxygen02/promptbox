"use client";

import { useState, useEffect } from "react";
import { Check, Zap, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PricingPage() {
  const [language, setLanguage] = useState<"zh" | "en">("zh");
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    const browserLang = navigator.language?.toLowerCase().startsWith('zh') ? 'zh' : 'en';
    setLanguage(browserLang);
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
      { 
        name: "免费", 
        subname: "free_d",
        price: "免费", 
        credits: "50 积分", 
        daily: "+10积分/天",
        features: ["基础模型", "7天历史"],
        cta: "当前方案",
        highlight: false
      },
      { 
        name: "Starter", 
        subname: "starter_d",
        price: "¥29", 
        period: "/月",
        credits: "500 积分", 
        daily: "+15积分/天",
        features: ["全部模型", "无限历史", "批量模式"],
        cta: "购买",
        highlight: false
      },
      { 
        name: "Pro", 
        subname: "pro_d",
        price: "¥99", 
        period: "/月",
        credits: "2000 积分", 
        daily: "+30积分/天",
        features: ["全部模型", "无限历史", "批量模式", "API接入"],
        cta: "购买",
        highlight: true
      },
    ],
    en: [
      { 
        name: "Free", 
        subname: "free_d",
        price: "Free", 
        credits: "50 credits", 
        daily: "+10 credits/day",
        features: ["Basic models", "7-day history"],
        cta: "Current Plan",
        highlight: false
      },
      { 
        name: "Starter", 
        subname: "starter_d",
        price: "$9", 
        period: "/mo",
        credits: "500 credits", 
        daily: "+15 credits/day",
        features: ["All models", "Unlimited history", "Batch mode"],
        cta: "Subscribe",
        highlight: false
      },
      { 
        name: "Pro", 
        subname: "pro_d",
        price: "$29", 
        period: "/mo",
        credits: "2000 credits", 
        daily: "+30 credits/day",
        features: ["All models", "Unlimited history", "Batch mode", "API access"],
        cta: "Subscribe",
        highlight: true
      },
    ],
  };

  const creditPacks = {
    zh: [
      { price: "¥9", credits: "80", bonus: "0", total: "80", unitPrice: "¥0.11" },
      { price: "¥19", credits: "200", bonus: "+20", total: "220", unitPrice: "¥0.086" },
      { price: "¥49", credits: "550", bonus: "+50", total: "600", unitPrice: "¥0.082" },
    ],
    en: [
      { price: "$2", credits: "60", bonus: "0", total: "60", unitPrice: "$0.033" },
      { price: "$4", credits: "150", bonus: "+15", total: "165", unitPrice: "$0.024" },
      { price: "$9", credits: "350", bonus: "+50", total: "400", unitPrice: "$0.023" },
    ],
  };

  const currentPlans = plans[language];
  const currentPacks = creditPacks[language];

  const handleLanguageToggle = () => {
    const newLang = language === "zh" ? "en" : "zh";
    setLanguage(newLang);
    window.dispatchEvent(new CustomEvent("language-change", { detail: newLang }));
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#faf8f5] py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* 月租方案 */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-slate-900 mb-3">
            {language === "zh" ? "选择方案" : "Choose Plan"}
          </h1>
          <p className="text-sm text-slate-500">
            {language === "zh" ? "按月订阅，享受每日登录奖励" : "Monthly subscription with daily login bonuses"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-16">
          {currentPlans.map((plan, index) => (
            <div
              key={plan.name}
              className={`bg-white rounded-2xl border p-6 flex flex-col ${
                plan.highlight 
                  ? "border-[#c75a2d] ring-2 ring-[#c75a2d]/20" 
                  : "border-slate-200"
              }`}
            >
              <div className="mb-1">
                <h3 className="text-base font-semibold text-slate-900">{plan.name}</h3>
                <p className="text-xs text-slate-400">{plan.subname}</p>
              </div>

              <div className="mt-4 mb-4">
                <span className="text-4xl font-bold text-slate-900">{plan.price}</span>
                {plan.period && <span className="text-slate-500 text-sm ml-1">{plan.period}</span>}
              </div>

              <div className={`rounded-lg px-3 py-2 mb-5 ${plan.highlight ? 'bg-[#c75a2d]/10' : 'bg-[#c75a2d]/5'}`}>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-[#c75a2d]">🪙</span>
                  <span className="text-[#c75a2d] font-medium">{plan.credits}</span>
                </div>
                <div className="text-xs text-slate-500 mt-1">{plan.daily}</div>
              </div>

              <ul className="space-y-3 mb-6 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-slate-600">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full py-2.5 rounded-lg font-medium ${
                  index === 0 
                    ? "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50" 
                    : plan.highlight 
                      ? "bg-[#c75a2d] hover:bg-[#b54d24] text-white"
                      : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
                variant={index === 0 ? "outline" : "default"}
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>

        {/* 积分包 */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Coins className="w-5 h-5 text-[#c75a2d]" />
            <h2 className="text-2xl font-bold text-slate-900">
              {language === "zh" ? "积分包" : "Credit Packs"}
            </h2>
          </div>
          <p className="text-sm text-slate-500">
            {language === "zh" ? "一次性购买，30天有效，无需订阅" : "One-time purchase, 30-day validity, no subscription"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {currentPacks.map((pack, index) => (
            <div
              key={pack.price}
              className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col hover:border-[#c75a2d]/50 transition-colors"
            >
              <div className="text-center mb-4">
                <span className="text-4xl font-bold text-slate-900">{pack.price}</span>
                <span className="text-slate-400 text-sm ml-1">
                  {language === "zh" ? "一次性" : "one-time"}
                </span>
              </div>

              <div className="bg-[#c75a2d]/5 rounded-lg px-4 py-3 mb-4 text-center">
                <div className="text-2xl font-bold text-[#c75a2d]">{pack.total}</div>
                <div className="text-xs text-slate-500">
                  {language === "zh" ? "总积分" : "total credits"}
                </div>
              </div>

              <div className="space-y-2 mb-6 text-sm text-slate-600">
                <div className="flex justify-between">
                  <span>{language === "zh" ? "基础积分" : "Base credits"}</span>
                  <span className="font-medium">{pack.credits}</span>
                </div>
                {pack.bonus !== "0" && (
                  <div className="flex justify-between text-green-600">
                    <span>{language === "zh" ? "赠送" : "Bonus"}</span>
                    <span className="font-medium">{pack.bonus}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-400 text-xs pt-2 border-t border-slate-100">
                  <span>{language === "zh" ? "单价" : "Unit price"}</span>
                  <span>{pack.unitPrice}</span>
                </div>
              </div>

              <div className="text-xs text-slate-400 text-center mb-4">
                {language === "zh" ? "30天有效 · 用完即止" : "30-day validity · Use as needed"}
              </div>

              <Button
                className="w-full py-2.5 rounded-lg font-medium bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-[#c75a2d]/50"
                variant="outline"
              >
                {language === "zh" ? "立即购买" : "Buy Now"}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
