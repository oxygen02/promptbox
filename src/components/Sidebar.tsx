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
  ChevronDown,
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
  const [hovered, setHovered] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const type = params.get("type") || "text";
      setContentType(type);
    }
  }, [pathname]);

  const handleMouseEnter = () => {
    if (hoverTimeout) clearTimeout(hoverTimeout);
    setHovered(true);
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => setHovered(false), 150);
    setHoverTimeout(timeout);
  };

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
      ref={sidebarRef}
      className="fixed left-0 top-16 bottom-0 z-40"
      style={{ width: hovered ? '200px' : '56px' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* 背景层 */}
      <div 
        className="absolute inset-0 glass-sidebar"
        style={{ 
          width: hovered ? '200px' : '56px',
          transition: 'width 0.3s ease-out'
        }}
      />
      
      {/* 内容层 */}
      <nav className="relative py-4" style={{ width: hovered ? '200px' : '56px' }}>
        {navSections.map((section) => (
          <div key={section.key} className="mb-2">
            {/* 一级标题 */}
            <div 
              className="flex items-center gap-2.5 px-3 py-2 mx-2 text-sm font-semibold text-slate-800"
              style={{ 
                justifyContent: hovered ? 'flex-start' : 'center',
                transition: 'all 0.3s ease-out'
              }}
            >
              <section.icon 
                className="w-5 h-5 text-slate-600 flex-shrink-0" 
                style={{ transform: hovered ? 'scale(1.1)' : 'scale(1)' }}
              />
              {hovered && (
                <span className="whitespace-nowrap overflow-hidden animate-fade-in">
                  {language === "zh" ? section.zh : section.en}
                </span>
              )}
            </div>
            
            {/* 二级项目 */}
            {section.items.map((item) => {
              const active = isActive(item.key, item.href);
              return (
                <button
                  key={item.key}
                  onClick={() => handleContentClick(item.key, item.href)}
                  className="flex items-center gap-2.5 px-3 py-2 mx-2 text-sm rounded-lg transition-all duration-200 relative w-full"
                  style={{ 
                    justifyContent: hovered ? 'flex-start' : 'center',
                    backgroundColor: active ? '#eff6ff' : 'transparent',
                    color: active ? '#2563eb' : '#475569',
                    borderLeft: active ? '3px solid #3b82f6' : '3px solid transparent',
                    marginLeft: active ? '5px' : '8px',
                    width: hovered ? 'calc(100% - 10px)' : 'calc(100% - 16px)'
                  }}
                >
                  <item.icon className="w-4 h-4 flex-shrink-0" style={{ transform: hovered ? 'scale(1.1)' : 'scale(1)' }} />
                  {hovered && (
                    <span className="whitespace-nowrap overflow-hidden animate-fade-in">
                      {language === "zh" ? item.zh : item.en}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
        
        {/* 底部用户信息 */}
        <div 
          className="mt-6 mx-2"
          style={{ paddingLeft: hovered ? '12px' : '0', paddingRight: hovered ? '12px' : '0' }}
        >
          <div 
            className="glass-card rounded-xl flex items-center gap-3"
            style={{ 
              justifyContent: hovered ? 'flex-start' : 'center',
              padding: hovered ? '12px' : '8px',
              transition: 'all 0.3s ease-out'
            }}
          >
            <div 
              className="rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0"
              style={{ 
                width: hovered ? '36px' : '32px', 
                height: hovered ? '36px' : '32px',
                transition: 'all 0.3s ease-out'
              }}
            >
              <User className="text-white w-4 h-4" />
            </div>
            {hovered && (
              <div className="whitespace-nowrap animate-fade-in">
                <div className="text-sm font-medium text-slate-800">
                  {language === "zh" ? "游客用户" : "Guest"}
                </div>
                <div className="text-xs text-slate-500">Lv.1</div>
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}
