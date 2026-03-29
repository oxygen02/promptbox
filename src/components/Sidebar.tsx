"use client";

import { useState, useEffect } from "react";
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
  const [contentType, setContentType] = useState<string>("text");

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
    <aside className="fixed left-0 top-16 bottom-0 w-[160px] glass-sidebar overflow-y-auto hidden md:block z-40">
      <nav className="py-4">
        {navSections.map((section) => (
          <div key={section.key} className="mb-4">
            {/* 一级标题 */}
            <div className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-800">
              <section.icon className="w-5 h-5 text-slate-600" />
              <span>{section.zh}</span>
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
                  <span className="truncate">{item.zh}</span>
                </button>
              );
            })}
          </div>
        ))}
        
        {/* 底部用户信息 */}
        <div className="px-4 py-3 mt-4 glass-card rounded-xl mx-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-slate-800 truncate">游客用户</div>
              <div className="text-xs text-slate-500">Lv.1</div>
            </div>
          </div>
        </div>
      </nav>
    </aside>
  );
}
