"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, Mail, Chrome } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const browserLang = typeof navigator !== 'undefined' && navigator.language?.toLowerCase().startsWith('zh') ? 'zh' : 'en';
  const [language, setLanguage] = useState<"zh" | "en">(browserLang);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: 登录逻辑
    router.push("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#f0f4f8' }}>
      <div className="glass-card rounded-2xl p-8 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-800">PromptBox</span>
            <span className="text-xs font-medium text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded">Pro</span>
          </Link>
          <h1 className="text-lg font-semibold text-slate-800 mt-6">
            {language === "zh" ? "登录" : "Sign In"}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {language === "zh" ? "欢迎回来，继续创作" : "Welcome back"}
          </p>
        </div>

        {/* 语言切换 */}
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setLanguage(language === "zh" ? "en" : "zh")}
            className="text-sm text-blue-500 hover:underline"
          >
            {language === "zh" ? "English" : "中文"}
          </button>
        </div>

        {/* 第三方登录 - 仅英文区显示 Google */}
        {language === "en" && (
          <div className="space-y-3 mb-6">
            <button className="w-full flex items-center justify-center gap-2 py-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
              <Chrome className="w-5 h-5 text-slate-600" />
              <span className="text-sm font-medium text-slate-700">Continue with Google</span>
            </button>
          </div>
        )}

        {/* 分隔线 - 仅英文区显示 */}
        {language === "en" && (
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-slate-200"></div>
            <span className="text-xs text-slate-400">OR</span>
            <div className="flex-1 h-px bg-slate-200"></div>
          </div>
        )}

        {/* 邮箱登录表单 */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={language === "zh" ? "邮箱地址" : "Email address"}
              className="input-field"
            />
          </div>
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={language === "zh" ? "密码" : "Password"}
              className="input-field"
            />
          </div>
          <button type="submit" className="btn-primary w-full py-2.5">
            {language === "zh" ? "登录" : "Sign In"}
          </button>
        </form>

        {/* 注册链接 */}
        <p className="text-center text-sm text-slate-500 mt-6">
          {language === "zh" ? "还没有账号？" : "Don't have an account?"}{" "}
          <Link href="/register" className="text-blue-500 hover:underline font-medium">
            {language === "zh" ? "立即注册" : "Sign Up"}
          </Link>
        </p>
      </div>
    </div>
  );
}
