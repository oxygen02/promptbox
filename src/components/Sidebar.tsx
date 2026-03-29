"use client";

import { useState, useEffect, useRef } from "react";
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
  const sidebarRef = useRef<HTMLElement>(null);

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
    <div 
      className="fixed left-0 top-16 bottom-0 z-40"
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* 侧边栏 */}
      <aside 
        ref={sidebarRef}
        className={cn(
          "h-full glass-sidebar hidden md:block transition-all duration-300 ease-out",
          isExpanded ? "w-[200px]" : "w-[56px]"
        )}
      >
        <nav className="py-4 h-full overflow-hidden">
          {navSections.map((section) => (
            <div key={section.key} className="mb-2">
              {/* 一级标题 */}
              <div className={cn(
                "flex items-center gap-2.5 px-3 py-2 mx-2 text-sm font-semibold text-slate-800 transition-all duration-300",
                isExpanded ? "justify-start" : "justify-center"
              )}>
                <section.icon className={cn(
                  "w-5 h-5 flex-shrink-0 transition-transform duration-300",
                  isExpanded && "scale-110"
                )} />
                <span className={cn(
                  "whitespace-nowrap transition-all duration-300 overflow-hidden",
                  isExpanded ? "opacity-100 max-w-[120px]" : "opacity-0 max-w-0"
                )}>
                  {language === "zh" ? section.zh : section.en}
                </span>
              </div>
              
              {/* 二级项目 */}
              <div className="overflow-hidden transition-all duration-300">
                {section.items.map((item) => {
                  const active = isActive(item.key, item.href);
                  return (
                    <button
                      key={item.key}
                      onClick={() => handleContentClick(item.key, item.href)}
                      className={cn(
                        "flex items-center gap-2.5 px-3 py-2 mx-2 text-sm rounded-lg transition-all duration-300 relative w-full",
                        isExpanded ? "justify-start" : "justify-center",
                        active
                          ? "bg-blue-50 text-blue-600 before:absolute before:left-0 before:top-2 before:bottom-2 before:w-[3px] before:bg-blue-500 before:rounded-r"
                          : "text-slate-600 hover:bg-slate-50"
                      )}
                    >
                      <item.icon className={cn(
                        "w-4 h-4 flex-shrink-0 transition-transform duration-300",
                        isExpanded && "scale-110"
                      )} />
                      <span className={cn(
                        "whitespace-nowrap transition-all duration-300 overflow-hidden",
                        isExpanded ? "opacity-100 max-w-[120px]" : "opacity-0 max-w-0"
                      )}>
                        {language === "zh" ? item.zh : item.en}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
          
          {/* 底部用户信息 */}
          <div className={cn(
            "mt-6 mx-2 transition-all duration-300 overflow-hidden",
            isExpanded ? "px-3" : "px-0"
          )}>
            <div className={cn(
              "glass-card rounded-xl flex items-center gap-3 transition-all duration-300",
              isExpanded ? "p-3 justify-start" : "p-2 justify-center"
            )}>
              <div className={cn(
                "rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0 transition-all duration-300",
                isExpanded ? "w-9 h-9" : "w-8 h-8"
              )}>
                <User className={cn("text-white", isExpanded ? "w-4 h-4" : "w-4 h-4")} />
              </div>
              <div className={cn(
                "transition-all duration-300 overflow-hidden whitespace-nowrap",
                isExpanded ? "opacity-100 max-w-[100px]" : "opacity-0 max-w-0"
              )}>
                <div className="text-sm font-medium text-slate-800">
                  {language === "zh" ? "游客用户" : "Guest"}
                </div>
                <div className="text-xs text-slate-500">Lv.1</div>
              </div>
            </div>
          </div>
        </nav>
      </aside>
      
      {/* 悬停触发区域 - 左侧 56px */}
      <div 
        className={cn(
          "absolute left-0 top-0 bottom-0 w-[56px] hover:bg-transparent",
          !isExpanded && "cursor-pointer"
        )}
      />
    </div>
  );
}
