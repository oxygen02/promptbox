"use client";

import { useState } from "react";
import Link from "next/link";
import { LogIn, Mail, Lock, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const [language, setLanguage] = useState<"zh" | "en">("zh");
  const [method, setMethod] = useState<"email" | "phone">("email");

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">PromptBox</h1>
          <p className="text-slate-600">{language === "zh" ? "登录您的账户" : "Sign in to your account"}</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          {/* Method Toggle */}
          <div className="flex rounded-lg bg-slate-100 p-1 mb-6">
            <button
              onClick={() => setMethod("email")}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${method === "email" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}
            >
              <Mail className="w-4 h-4 inline mr-2" />
              {language === "zh" ? "邮箱" : "Email"}
            </button>
            <button
              onClick={() => setMethod("phone")}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${method === "phone" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}
            >
              <Smartphone className="w-4 h-4 inline mr-2" />
              {language === "zh" ? "手机" : "Phone"}
            </button>
          </div>

          <form className="space-y-4">
            {method === "email" ? (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{language === "zh" ? "邮箱" : "Email"}</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    placeholder="example@mail.com"
                    className="w-full pl-11 pr-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-800"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{language === "zh" ? "手机号" : "Phone"}</label>
                <div className="relative">
                  <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="tel"
                    placeholder="+86 138 0000 0000"
                    className="w-full pl-11 pr-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-800"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{language === "zh" ? "密码" : "Password"}</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-800"
                />
              </div>
            </div>

            <Button className="w-full bg-slate-800 hover:bg-slate-700">
              <LogIn className="w-4 h-4 mr-2" />
              {language === "zh" ? "登录" : "Sign In"}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            <span className="text-slate-500">{language === "zh" ? "还没有账户？" : "Don't have an account?"}</span>
            <Link href="/register" className="text-blue-500 hover:underline ml-1">
              {language === "zh" ? "立即注册" : "Sign Up"}
            </Link>
          </div>
        </div>

        <div className="mt-4 text-center">
          <button onClick={() => setLanguage(language === "zh" ? "en" : "zh")} className="text-sm text-slate-500 hover:text-slate-700">
            {language === "zh" ? "Switch to English" : "切换到中文"}
          </button>
        </div>
      </div>
    </div>
  );
}
