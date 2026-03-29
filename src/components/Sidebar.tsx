"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  Sparkles,
  CreditCard
} from "lucide-react";
import { cn } from "@/lib/utils";

const contentCategories = [
  { key: "text", href: "/?type=text", icon: FileText, label: "文字文档", labelEn: "Text" },
  { key: "image", href: "/?type=image", icon: Image, label: "图片视觉", labelEn: "Image" },
  { key: "video", href: "/?type=video", icon: Video, label: "视频解构", labelEn: "Video" },
  { key: "web", href: "/?type=web", icon: Globe, label: "网页设计", labelEn: "Web" },
];

const aiTools = [
  { href: "/templates", icon: BookOpen, label: "提示词模板库", labelEn: "Prompt Templates" },
  { href: "/tools", icon: Link2, label: "创作推荐网站", labelEn: "AI Tools" },
];

const personalCenter = [
  { href: "/history", icon: History, label: "历史记录", labelEn: "History" },
  { href: "/favorites", icon: Star, label: "模板收藏", labelEn: "Favorites" },
  { href: "/settings", icon: Settings, label: "设置", labelEn: "Settings" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [language, setLanguage] = useState<"zh" | "en">("zh");
  const [expandedSections, setExpandedSections] = useState({
    content: true,
    aiTools: true,
    personal: true,
  });

  const toggleSection = (section: "content" | "aiTools" | "personal") => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-60 glass-sidebar overflow-y-auto hidden md:block">
      <nav className="p-4 space-y-1">
        {/* 内容分类 */}
        <div className="mb-4">
          <button
            onClick={() => toggleSection("content")}
            className="w-full flex items-center justify-between px-3 py-2.5 text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <FileText className="w-5 h-5 text-slate-500" />
              <span className="text-sm font-medium">
                {language === "zh" ? "内容分类" : "Content"}
              </span>
            </div>
            <ChevronDown className={cn(
              "w-4 h-4 text-slate-400 transition-transform",
              expandedSections.content && "rotate-180"
            )} />
          </button>
          
          {expandedSections.content && (
            <div className="ml-2 mt-1 space-y-0.5">
              {contentCategories.map(cat => (
                <Link
                  key={cat.key}
                  href={cat.href}
                  className={cn(
                    "flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg transition-colors",
                    pathname === cat.href || (cat.href !== "/" && pathname.includes(cat.href))
                      ? "bg-slate-100 text-slate-900"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                  )}
                >
                  <cat.icon className="w-4 h-4" />
                  {language === "zh" ? cat.label : cat.labelEn}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* AI 工具箱 */}
        <div className="mb-4">
          <button
            onClick={() => toggleSection("aiTools")}
            className="w-full flex items-center justify-between px-3 py-2.5 text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Zap className="w-5 h-5 text-slate-500" />
              <span className="text-sm font-medium">
                {language === "zh" ? "AI 工具箱" : "AI Tools"}
              </span>
            </div>
            <ChevronDown className={cn(
              "w-4 h-4 text-slate-400 transition-transform",
              expandedSections.aiTools && "rotate-180"
            )} />
          </button>
          
          {expandedSections.aiTools && (
            <div className="ml-2 mt-1 space-y-0.5">
              {aiTools.map(tool => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className={cn(
                    "flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg transition-colors",
                    pathname === tool.href
                      ? "bg-slate-100 text-slate-900"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                  )}
                >
                  <tool.icon className="w-4 h-4" />
                  {language === "zh" ? tool.label : tool.labelEn}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* 个人中心 */}
        <div className="mb-4">
          <button
            onClick={() => toggleSection("personal")}
            className="w-full flex items-center justify-between px-3 py-2.5 text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <User className="w-5 h-5 text-slate-500" />
              <span className="text-sm font-medium">
                {language === "zh" ? "个人中心" : "Account"}
              </span>
            </div>
            <ChevronDown className={cn(
              "w-4 h-4 text-slate-400 transition-transform",
              expandedSections.personal && "rotate-180"
            )} />
          </button>
          
          {expandedSections.personal && (
            <div className="ml-2 mt-1 space-y-0.5">
              {personalCenter.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg transition-colors",
                    pathname === item.href
                      ? "bg-slate-100 text-slate-900"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  {language === "zh" ? item.label : item.labelEn}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* 积分卡片 - 液态玻璃效果 */}
        <div className="mt-6 p-4 glass-card rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <CreditCard className="w-4 h-4 text-slate-500" />
            <span className="text-xs text-slate-500">
              {language === "zh" ? "我的积分" : "My Credits"}
            </span>
          </div>
          <div className="text-2xl font-bold text-slate-800">520</div>
          <div className="text-xs text-slate-400 mt-1">
            {language === "zh" ? "每日登录 +10" : "Daily +10"}
          </div>
        </div>
      </nav>
    </aside>
  );
}
