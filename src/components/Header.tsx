"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { Sparkles, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

// 动态导入月球组件
const MoonCanvas = dynamic(() => import("@/components/MoonCanvas"), {
  ssr: false,
  loading: () => <div className="w-7 h-7 rounded-full bg-gray-200 animate-pulse" />,
});

const navItems = [
  { href: "/", zh: "首页", en: "Home" },
  { href: "/pricing", zh: "定价", en: "Pricing" },
  { href: "/about", zh: "关于", en: "About" },
];

export default function Header() {
  const pathname = usePathname();
  const [language, setLanguage] = useState<"zh" | "en">("zh");
  const [scrolled, setScrolled] = useState(false);

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 h-16 z-50 transition-all duration-300",
      scrolled ? "glass-nav" : "bg-white/90 backdrop-blur-sm border-b border-slate-200"
    )}>
      <div className="h-full max-w-[1600px] mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold text-slate-800">PromptBox</span>
          <span className="text-xs font-medium text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded">Pro</span>
        </Link>

        {/* 月球 + Slogan */}
        <div className="hidden md:flex items-center gap-2.5">
          <MoonCanvas size={32} />
          <span 
            className="text-xl font-bold text-slate-800"
            style={{
              textShadow: '2px 2px 4px rgba(0,0,0,0.15), 0 0 20px rgba(59,130,246,0.2)',
              background: 'linear-gradient(135deg, #1e293b 0%, #3b82f6 50%, #1e293b 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '0.05em',
            }}
          >
            创作从模仿开始
          </span>
        </div>

        {/* 导航 */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200",
                pathname === item.href
                  ? "bg-slate-100 text-slate-900"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              )}
            >
              {language === "zh" ? item.zh : item.en}
            </Link>
          ))}
        </nav>

        {/* 右侧功能 */}
        <div className="flex items-center gap-3">
          {/* 语言切换 */}
          <button
            onClick={() => setLanguage(language === "zh" ? "en" : "zh")}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-sm text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <Globe className="w-4 h-4" />
            <span className="font-medium">{language === "zh" ? "EN" : "中"}</span>
          </button>

          {/* 登录/注册 */}
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              {language === "zh" ? "登录" : "Login"}
            </Link>
            <Link
              href="/register"
              className="px-3.5 py-1.5 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
            >
              {language === "zh" ? "注册" : "Sign Up"}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
