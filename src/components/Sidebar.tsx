"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { 
  FileText, 
  Image, 
  Video, 
  Globe,
  Monitor,
  Zap,
  BookOpen,
  Link2,
  User,
  History,
  Star,
  Settings,
  Layers,
  Type,
  Palette,
  type LucideIcon,
} from "lucide-react";

interface NavItem {
  key: string;
  icon: LucideIcon;
  zh: string;
  en: string;
  href?: string;
}

interface NavSection {
  key: string;
  icon: LucideIcon;
  zh: string;
  en: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    key: "content",
    icon: Layers,
    zh: "内容分类",
    en: "Content",
    items: [
      { key: "text", icon: Type, zh: "文字文档", en: "Text" },
      { key: "image", icon: Palette, zh: "图片视觉", en: "Image" },
      { key: "video", icon: Video, zh: "视频解构", en: "Video" },
      { key: "web", icon: Monitor, zh: "网页设计", en: "Web" },
    ],
  },
  {
    key: "tools",
    icon: Zap,
    zh: "AI 工具箱",
    en: "AI Tools",
    items: [
      { key: "templates", icon: BookOpen, zh: "提示词模板库", en: "Templates", href: "/templates" },
      { key: "websites", icon: Link2, zh: "创作推荐网站", en: "Websites", href: "/tools" },
    ],
  },
  {
    key: "personal",
    icon: User,
    zh: "个人中心",
    en: "Account",
    items: [
      { key: "history", icon: History, zh: "历史记录", en: "History", href: "/history" },
      { key: "favorites", icon: Star, zh: "模板收藏", en: "Favorites", href: "/favorites" },
      { key: "settings", icon: Settings, zh: "设置", en: "Settings", href: "/settings" },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [contentType, setContentType] = useState<string>("text");
  // 默认中文，避免 SSR hydration mismatch
  const [language, setLanguage] = useState<"zh" | "en">("zh");

  // 客户端挂载后读取语言设置
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const savedLang = localStorage.getItem('language');
    if (savedLang === 'zh' || savedLang === 'en') {
      setLanguage(savedLang);
    } else {
      const browserLang = navigator.language?.toLowerCase().startsWith('zh') ? 'zh' : 'en';
      setLanguage(browserLang);
    }
  }, []);

  // 监听 pathname 变化
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const type = params.get("type") || "text";
      setContentType(type);
    }
  }, [pathname]);

  // 监听语言切换事件（响应 Header 和其他页面的语言切换）
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const handleLanguageChange = (e: any) => {
      setLanguage(e.detail);
    };
    
    window.addEventListener("language-change", handleLanguageChange);
    return () => window.removeEventListener("language-change", handleLanguageChange);
  }, []);

  // 监听自定义事件（首页触发）
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const handleContentTypeChange = (e: CustomEvent) => {
      setContentType(e.detail);
    };
    
    window.addEventListener("content-type-change", handleContentTypeChange as EventListener);
    return () => window.removeEventListener("content-type-change", handleContentTypeChange as EventListener);
  }, []);

  const handleContentClick = (key: string, href?: string) => {
    if (href) {
      router.push(href);
    } else {
      setContentType(key);
      // 触发自定义事件，让首页更新选中状态
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("content-type-change", { detail: key }));
      }
      router.push(`/?type=${key}`);
    }
  };

  const isActive = (key: string, href?: string) => {
    if (href) return pathname === href;
    return contentType === key && pathname === "/";
  };

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-[160px] glass-sidebar hidden md:flex flex-col z-40 border-r border-slate-200">
      <nav className="flex-1 py-4 overflow-y-auto">
        {navSections.map((section) => (
          <div key={section.key} className="mb-4">
            {/* 一级标题 */}
            <div className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-800">
              <section.icon className="w-5 h-5 text-slate-600" />
              <span>{language === "zh" ? section.zh : section.en}</span>
            </div>
            
            {/* 二级项目 */}
            {section.items.map((item) => {
              const active = isActive(item.key, item.href);
              return (
                <button
                  key={item.key}
                  onClick={() => handleContentClick(item.key, item.href)}
                  className={`w-full flex items-center gap-2 px-4 py-2 text-sm transition-all duration-200 relative ${
                    active
                      ? "bg-slate-100 text-slate-900 before:absolute before:left-0 before:top-2 before:bottom-2 before:w-[3px] before:bg-slate-700 before:rounded-r"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{language === "zh" ? item.zh : item.en}</span>
                </button>
              );
            })}
          </div>
        ))}
      </nav>
      
      {/* 底部用户信息 - 固定在左下角 */}
      <div className="px-4 py-3 border-t border-slate-200/50">
        <button onClick={() => router.push("/login")} className="w-full flex items-center gap-3 p-2 glass-card rounded-xl hover:scale-[1.02] transition-transform cursor-pointer">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center flex-shrink-0">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0 text-left">
            <div className="text-sm font-medium text-slate-800 truncate">{language === "zh" ? "游客用户" : "Guest"}</div>
            <div className="text-xs text-slate-500">Lv.1</div>
          </div>
        </button>
      </div>
    </aside>
  );
}
