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
  CreditCard,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

const contentCategories = [
  { key: "text", icon: FileText, label: "文字文档", labelEn: "Text" },
  { key: "image", icon: Image, label: "图片视觉", labelEn: "Image" },
  { key: "video", icon: Video, label: "视频解构", labelEn: "Video" },
  { key: "web", icon: Globe, label: "网页设计", labelEn: "Web" },
];

const aiTools = [
  { key: "templates", href: "/templates", icon: BookOpen, label: "提示词模板库", labelEn: "Templates" },
  { key: "tools", href: "/tools", icon: Link2, label: "创作推荐网站", labelEn: "AI Tools" },
];

const personalCenter = [
  { key: "history", href: "/history", icon: History, label: "历史记录", labelEn: "History" },
  { key: "favorites", href: "/favorites", icon: Star, label: "模板收藏", labelEn: "Favorites" },
  { key: "settings", href: "/settings", icon: Settings, label: "设置", labelEn: "Settings" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [language, setLanguage] = useState<"zh" | "en">("zh");
  const [contentType, setContentType] = useState<string>("text");

  // 从 URL 获取当前内容类型
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const type = params.get("type") || "text";
      setContentType(type);
    }
  }, [pathname]);

  const handleContentClick = (key: string) => {
    setContentType(key);
    router.push(`/?type=${key}`);
  };

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-[260px] glass-sidebar overflow-y-auto hidden md:block">
      <nav className="p-4">
        {/* 内容分类 - 永久展开 */}
        <div className="mb-6">
          <div className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700">
            <FileText className="w-4 h-4" />
            <span>{language === "zh" ? "内容分类" : "Content"}</span>
          </div>
          
          <div className="mt-1 space-y-0.5">
            {contentCategories.map(cat => (
              <button
                key={cat.key}
                onClick={() => handleContentClick(cat.key)}
                className={cn(
                  "w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg transition-all duration-200 relative",
                  contentType === cat.key
                    ? "active-item"
                    : "text-slate-600 hover-item"
                )}
              >
                <cat.icon className="w-4 h-4" />
                {language === "zh" ? cat.label : cat.labelEn}
              </button>
            ))}
          </div>
        </div>

        {/* AI 工具箱 - 永久展开 */}
        <div className="mb-6">
          <div className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700">
            <Zap className="w-4 h-4" />
            <span>{language === "zh" ? "AI 工具箱" : "AI Tools"}</span>
          </div>
          
          <div className="mt-1 space-y-0.5">
            {aiTools.map(tool => (
              <Link
                key={tool.key}
                href={tool.href}
                className={cn(
                  "flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg transition-all duration-200 relative",
                  pathname === tool.href
                    ? "active-item"
                    : "text-slate-600 hover-item"
                )}
              >
                <tool.icon className="w-4 h-4" />
                {language === "zh" ? tool.label : tool.labelEn}
              </Link>
            ))}
          </div>
        </div>

        {/* 个人中心 - 永久展开 */}
        <div className="mb-6">
          <div className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700">
            <User className="w-4 h-4" />
            <span>{language === "zh" ? "个人中心" : "Account"}</span>
          </div>
          
          <div className="mt-1 space-y-0.5">
            {personalCenter.map(item => (
              <Link
                key={item.key}
                href={item.href}
                className={cn(
                  "flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg transition-all duration-200 relative",
                  pathname === item.href
                    ? "active-item"
                    : "text-slate-600 hover-item"
                )}
              >
                <item.icon className="w-4 h-4" />
                {language === "zh" ? item.label : item.labelEn}
              </Link>
            ))}
          </div>
        </div>

        {/* 用户信息卡片 - 仅显示头像、状态、等级 */}
        <div className="mt-8 p-4 glass-card rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-sm font-medium text-slate-800">
                {language === "zh" ? "游客用户" : "Guest"}
              </div>
              <div className="text-xs text-slate-500 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                Lv.1
              </div>
            </div>
          </div>
        </div>
      </nav>
    </aside>
  );
}
