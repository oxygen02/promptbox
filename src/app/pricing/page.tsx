"use client";

import { useState } from "react";
import { Check, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PricingPage() {
  const [language, setLanguage] = useState<"zh" | "en">("zh");

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
      { name: "Enterprise", price: "$99", credits: "10000", features: ["10000 credits", "Custom models", "Dedicated support", "Unlimited collaboration", "Private deployment", "SLA"], cta: "Contact Us" },
    ],
  };

  const currentPlans = plans[language];

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            {language === "zh" ? "选择您的计划" : "Choose Your Plan"}
          </h1>
          <p className="text-lg text-slate-600 mb-6">
            {language === "zh" ? "灵活的定价方案，满足不同需求" : "Flexible pricing for every need"}
          </p>
          <Button variant="outline" onClick={() => setLanguage(language === "zh" ? "en" : "zh")}>
            {language === "zh" ? "Switch to English" : "切换到中文"}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {currentPlans.map((plan, index) => (
            <div
              key={plan.name}
              className={`bg-white rounded-2xl border p-6 shadow-sm hover:shadow-lg transition-shadow ${
                index === 0 ? "border-slate-200" : index === 2 ? "border-blue-500 ring-2 ring-blue-100" : "border-slate-200"
              }`}
            >
              {index === 2 && (
                <div className="flex items-center justify-center mb-4">
                  <span className="bg-blue-500 text-white text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    {language === "zh" ? "最受欢迎" : "Most Popular"}
                  </span>
                </div>
              )}
              <h3 className="text-lg font-semibold text-slate-900">{plan.name}</h3>
              <div className="mt-4 mb-6">
                <span className="text-4xl font-bold text-slate-900">{plan.price}</span>
                <span className="text-slate-500 text-sm ml-2">/ {plan.credits}</span>
              </div>
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-slate-600">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                className={`w-full ${index === 0 ? "bg-slate-100 text-slate-700 hover:bg-slate-200" : index === 2 ? "bg-blue-500 hover:bg-blue-600" : "bg-slate-800 hover:bg-slate-700"}`}
                variant={index === 0 ? "secondary" : "default"}
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
