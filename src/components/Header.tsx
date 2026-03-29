"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Sparkles, 
  Globe, 
} from "lucide-react";
import { cn } from "@/lib/utils";

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
        {/* Logo + Slogan */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-slate-800">PromptBox</span>
            <span className="text-xs font-medium text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded">Pro</span>
          </Link>

          {/* Slogan + 月球动画 */}
          <div className="hidden md:flex items-center gap-2">
            {/* 月球 - 月食效果 */}
            <div className="relative w-7 h-7">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-100 to-gray-300 shadow-lg">
                {/* 陨石坑 */}
                <div className="absolute top-1 left-1.5 w-1.5 h-1.5 rounded-full bg-gray-400/40"></div>
                <div className="absolute top-3 left-4 w-2 h-2 rounded-full bg-gray-400/30"></div>
                <div className="absolute top-5 left-2 w-1 h-1 rounded-full bg-gray-400/50"></div>
                <div className="absolute top-2 right-3 w-2 h-2 rounded-full bg-gray-400/25"></div>
                <div className="absolute bottom-3 left-3 w-1.5 h-1.5 rounded-full bg-gray-400/35"></div>
                <div className="absolute bottom-1.5 right-4 w-1.2 h-1.2 rounded-full bg-gray-400/45"></div>
              </div>
              {/* 月食阴影 - 从右向左移动 */}
              <div className="absolute inset-0 rounded-full bg-black/30 animate-pulse"></div>
            </div>
            <span className="text-sm font-medium text-slate-700 drop-shadow-sm">创作从模仿开始</span>
          </div>
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
