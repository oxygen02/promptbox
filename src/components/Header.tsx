"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, Globe, User, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Header() {
  const pathname = usePathname();
  const [language, setLanguage] = useState<"zh" | "en">("zh");

  const navItems = [
    { href: "/", label: "首页", labelEn: "Home" },
    { href: "/pricing", label: "定价", labelEn: "Pricing" },
    { href: "/about", label: "关于", labelEn: "About" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-50">
      <div className="h-full max-w-7xl mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-slate-700 to-slate-900 rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-slate-800">PromptBox</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-4 py-2 text-base font-medium rounded-lg transition-colors ${
                pathname === item.href
                  ? "bg-slate-100 text-slate-900"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              {language === "zh" ? item.label : item.labelEn}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Language Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLanguage(language === "zh" ? "en" : "zh")}
            className="flex items-center gap-1"
          >
            <Globe className="w-4 h-4" />
            <span className="text-sm">{language === "zh" ? "EN" : "中文"}</span>
          </Button>

          {/* Login */}
          <Link href="/login">
            <Button variant="ghost" size="sm" className="flex items-center gap-1">
              <LogIn className="w-4 h-4" />
              <span className="text-sm">{language === "zh" ? "登录" : "Login"}</span>
            </Button>
          </Link>

          {/* Register */}
          <Link href="/register">
            <Button size="sm" className="bg-slate-800 hover:bg-slate-700">
              <User className="w-4 h-4 mr-1" />
              {language === "zh" ? "注册" : "Sign Up"}
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
