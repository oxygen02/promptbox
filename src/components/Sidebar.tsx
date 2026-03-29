"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  FileText, 
  Image, 
  Video, 
  Globe,
  Zap,
  BookOpen,
  Link2,
  User,
  History,
  Star,
  Settings,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

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
    icon: FileText,
    zh: "内容分类",
    en: "Content",
    items: [
      { key: "text", icon: FileText, zh: "文字文档", en: "Text" },
      { key: "image", icon: Image, zh: "图片视觉", en: "Image" },
      { key: "video", icon: Video, zh: "视频解构", en: "Video" },
      { key: "web", icon: Globe, zh: "网页设计", en: "Web" },
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
  const [language, setLanguage] = useState<"zh" | "en">("zh");
  const [contentType, setContentType] = useState<string>("text");
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const type = params.get("type") || "text";
      setContentType(type);
    }
  }, [pathname]);

  const handleContentClick = (key: string, href?: string) => {
    if (href) {
      router.push(href);
    } else {
      setContentType(key);
      router.push(`/?type=${key}`);
    }
  };

  const isActive = (key: string, href?: string) => {
    if (href) return pathname === href;
    return contentType === key && pathname === "/";
  };

  return (
    <aside 
      className={cn(
        "fixed left-0 top-16 bottom-0 glass-sidebar overflow-hidden hidden md:block transition-all duration-300 z-40",
        isExpanded ? "w-[200px]" : "w-[56px]"
      )}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <nav className="py-4">
        {navSections.map((section) => (
          <div key={section.key} className="mb-3">
            {/* 一级标题 */}
            <div className={cn(
              "flex items-center gap-2.5 px-3 py-2 mx-2 text-sm font-semibold text-slate-800 transition-all duration-200",
              isExpanded ? "justify-start" : "justify-center"
            )}>
              <section.icon className="w-5 h-5 text-slate-600 flex-shrink-0" />
              {isExpanded && <span className="truncate">{language === "zh" ? section.zh : section.en}</span>}
            </div>
            
            {/* 二级项目 */}
            <div className={cn(
              "transition-all duration-200",
              isExpanded ? "opacity-100" : "opacity-100"
            )}>
              {section.items.map((item) => {
                const active = isActive(item.key, item.href);
                return (
                  <button
                    key={item.key}
                    onClick={() => handleContentClick(item.key, item.href)}
                    className={cn(
                      "flex items-center gap-2.5 px-3 py-2 mx-2 text-sm rounded-lg transition-all duration-200 relative w-full",
                      isExpanded ? "justify-start" : "justify-center",
                      active
                        ? "bg-blue-50 text-blue-600 before:absolute before:left-0 before:top-2 before:bottom-2 before:w-[3px] before:bg-blue-500 before:rounded-r"
                        : "text-slate-600 hover:bg-slate-50"
                    )}
                  >
                    <item.icon className="w-4 h-4 flex-shrink-0" />
                    {isExpanded && <span className="truncate">{language === "zh" ? item.zh : item.en}</span>}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
        
        {/* 底部用户信息 */}
        <div className={cn(
          "mt-6 transition-all duration-200 overflow-hidden",
          isExpanded ? "px-3" : "px-0"
        )}>
          <div className={cn(
            "glass-card rounded-xl mx-2 flex items-center gap-3",
            isExpanded ? "p-3" : "p-2 justify-center"
          )}>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 text-white" />
            </div>
            {isExpanded && (
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-slate-800 truncate">
                  {language === "zh" ? "游客用户" : "Guest"}
                </div>
                <div className="text-xs text-slate-500">Lv.1</div>
              </div>
            )}
          </div>
        </div>
      </nav>
    </aside>
  );
}
