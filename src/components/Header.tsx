"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Sparkles, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

const MoonCanvas = dynamic(() => import("@/components/MoonCanvas"), {
  ssr: false,
  loading: () => <div className="w-7 h-7 rounded-full bg-slate-200 animate-pulse" />,
});

const navItems = [
  { href: "/", zh: "首页", en: "Home" },
  { href: "/pricing", zh: "定价", en: "Pricing" },
  { href: "/about", zh: "关于", en: "About" },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [language, setLanguage] = useState<"zh" | "en">("zh");

  // 从 localStorage 读取语言设置
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedLang = localStorage.getItem('promptbox-language') as "zh" | "en";
      if (savedLang) {
        setLanguage(savedLang);
      }
    }
  }, [pathname]);

  // 切换语言并保存到 localStorage
  const toggleLanguage = () => {
    const newLang = language === "zh" ? "en" : "zh";
    setLanguage(newLang);
    if (typeof window !== "undefined") {
      localStorage.setItem('promptbox-language', newLang);
      window.dispatchEvent(new CustomEvent("language-change", { detail: newLang }));
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200/50">
      <div className="h-full max-w-[1600px] mx-auto px-4 md:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-9 h-9 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" className="w-full h-full">
              {/* 3D Box - Front face */}
              <path d="M12 20 L32 12 L52 20 L52 48 L32 56 L12 48 Z" fill="#3b82f6"/>
              {/* 3D Box - Top face */}
              <path d="M12 20 L32 12 L52 20 L32 28 Z" fill="#60a5fa"/>
              {/* 3D Box - Right face */}
              <path d="M52 20 L32 28 L32 56 L52 48 Z" fill="#1d4ed8"/>
              {/* Box opening/inner */}
              <rect x="20" y="28" width="24" height="20" rx="3" fill="#1e40af" opacity="0.3"/>
              {/* Stars/Sparkles */}
              <circle cx="26" cy="34" r="2" fill="white"/>
              <circle cx="42" cy="32" r="1.5" fill="white"/>
              <circle cx="38" cy="42" r="2" fill="white"/>
              <circle cx="24" cy="40" r="1" fill="white"/>
            </svg>
          </div>
          <span className="text-lg font-bold text-slate-800">PromptBox</span>
          <span className="text-xs font-medium text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded">Pro</span>
        </Link>

        {/* 月球 + Slogan */}
        <div className="flex items-center gap-3 mx-2 md:mx-4 flex-1 justify-center min-w-0">
          <div className="flex-shrink-0">
            <MoonCanvas size={36} />
          </div>
          <div className="flex flex-col">
            <span 
              className="text-2xl font-bold whitespace-nowrap text-slate-800"
              style={{
                letterSpacing: '0.05em',
              }}
            >
              {language === "zh" ? "创作从模仿开始" : "Creation Starts from Imitation"}
            </span>
            <span 
              className="text-sm font-medium whitespace-nowrap text-slate-500"
              style={{
                letterSpacing: '0.03em',
                fontSize: 'calc(1rem * 0.7)',
              }}
            >
              {language === "zh" ? "逆向倒推多模态提示词" : "Reverse-engineer Multimodal Prompts"}
            </span>
          </div>
        </div>

        {/* 导航 */}
        <nav className="hidden md:flex items-center gap-1 flex-shrink-0">
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200",
                pathname === item.href
                  ? "bg-slate-100 text-slate-800"
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
              )}
            >
              {language === "zh" ? item.zh : item.en}
            </Link>
          ))}
        </nav>

        {/* 右侧功能 */}
        <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
          {/* 语言切换 */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-sm text-slate-500 hover:bg-slate-100 transition-colors"
          >
            <Globe className="w-4 h-4" />
            <span className="font-medium hidden sm:inline">{language === "zh" ? "EN" : "中"}</span>
          </button>

          {/* 登录/注册 */}
          <div className="hidden sm:flex items-center gap-2">
            <Link
              href="/login"
              className="px-3 py-1.5 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
            >
              {language === "zh" ? "登录" : "Login"}
            </Link>
            <Link
              href="/register"
              className="px-4 py-1.5 text-sm font-semibold text-white bg-slate-800 hover:bg-slate-900 rounded-lg transition-colors shadow-sm"
            >
              {language === "zh" ? "注册" : "Sign Up"}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
