"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, Chrome } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [language, setLanguage] = useState<"zh" | "en">("zh");
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    setMounted(true);
    // 从 localStorage 读取语言设置
    const savedLang = localStorage.getItem('promptbox-language') as "zh" | "en";
    if (savedLang) {
      setLanguage(savedLang);
    } else {
      const browserLang = navigator.language?.toLowerCase().startsWith('zh') ? 'zh' : 'en';
      setLanguage(browserLang);
    }
  }, []);

  useEffect(() => {
    const handleLanguageChange = (e: any) => {
      setLanguage(e.detail);
    };
    window.addEventListener("language-change", handleLanguageChange);
    return () => window.removeEventListener("language-change", handleLanguageChange);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: 登录逻辑
    router.push("/");
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#f0f4f8' }}>
      <div className="glass-card rounded-2xl p-8 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-9 h-9 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" className="w-full h-full">
                <path d="M12 20 L32 12 L52 20 L52 48 L32 56 L12 48 Z" fill="#3b82f6"></path>
                <path d="M12 20 L32 12 L52 20 L32 28 Z" fill="#60a5fa"></path>
                <path d="M52 20 L32 28 L32 56 L52 48 Z" fill="#1d4ed8"></path>
                <rect x="20" y="28" width="24" height="20" rx="3" fill="#1e40af" opacity="0.3"></rect>
                <circle cx="26" cy="34" r="2" fill="white"></circle>
                <circle cx="42" cy="32" r="1.5" fill="white"></circle>
                <circle cx="38" cy="42" r="2" fill="white"></circle>
                <circle cx="24" cy="40" r="1" fill="white"></circle>
              </svg>
            </div>
            <span className="text-lg font-bold text-slate-800">PromptBox</span>
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
            onClick={() => {
              const newLang = language === "zh" ? "en" : "zh";
              setLanguage(newLang);
              localStorage.setItem('promptbox-language', newLang);
              window.dispatchEvent(new CustomEvent("language-change", { detail: newLang }));
            }}
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