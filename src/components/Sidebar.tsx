"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  FileText,
  Image,
  Video,
  Globe,
  BookOpen,
  Link2,
  History,
  Star,
  Settings,
  ChevronDown,
  ChevronRight,
  Zap,
  User,
  CreditCard,
} from "lucide-react";

interface SidebarProps {
  language?: "zh" | "en";
}

export default function Sidebar({ language = "zh" }: SidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const typeParam = searchParams.get("type");

  // Default expanded: content, tools and profile
  const [openMenus, setOpenMenus] = useState<string[]>(["content", "tools", "profile"]);

  const toggleMenu = (menu: string) => {
    setOpenMenus((prev) =>
      prev.includes(menu)
        ? prev.filter((m) => m !== menu)
        : [...prev, menu]
    );
  };

  const isActive = (path: string, params?: string) => {
    if (params) {
      return pathname === path && typeParam === params;
    }
    return pathname === path;
  };

  const menuItems = {
    content: {
      label: language === "zh" ? "内容分类" : "Content",
      icon: FileText,
      items: [
        {
          label: language === "zh" ? "文字文档" : "Text & Docs",
          icon: FileText,
          href: "/?type=text",
          type: "text",
        },
        {
          label: language === "zh" ? "图片视觉" : "Image & Vision",
          icon: Image,
          href: "/?type=image",
          type: "image",
        },
        {
          label: language === "zh" ? "视频解构" : "Video",
          icon: Video,
          href: "/?type=video",
          type: "video",
        },
        {
          label: language === "zh" ? "网页设计" : "Web Design",
          icon: Globe,
          href: "/?type=web",
          type: "web",
        },
      ],
    },
    tools: {
      label: language === "zh" ? "AI 工具箱" : "AI Tools",
      icon: Zap,
      items: [
        {
          label: language === "zh" ? "提示词模板库" : "Prompt Templates",
          icon: BookOpen,
          href: "/templates",
        },
        {
          label: language === "zh" ? "创作推荐网站" : "Creative Tools",
          icon: Link2,
          href: "/tools",
        },
      ],
    },
    profile: {
      label: language === "zh" ? "个人中心" : "Profile",
      icon: User,
      items: [
        {
          label: language === "zh" ? "历史记录" : "History",
          icon: History,
          href: "/history",
        },
        {
          label: language === "zh" ? "模板收藏" : "Favorites",
          icon: Star,
          href: "/favorites",
        },
        {
          label: language === "zh" ? "设置" : "Settings",
          icon: Settings,
          href: "/settings",
        },
      ],
    },
  };

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-60 bg-white border-r border-slate-200 overflow-y-auto hidden md:block">
      <nav className="p-4">
        {Object.entries(menuItems).map(([key, menu]) => (
          <div key={key} className="mb-2">
            <button
              onClick={() => toggleMenu(key)}
              className="w-full flex items-center justify-between px-3 py-2.5 text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <menu.icon className="w-5 h-5" />
                <span className="text-sm font-medium">{menu.label}</span>
              </div>
              {openMenus.includes(key) ? (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {openMenus.includes(key) && (
              <div className="ml-2 mt-1 space-y-0.5">
                {menu.items.map((item: any) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg transition-colors ${
                      isActive(item.href, item.type)
                        ? "bg-slate-800 text-white"
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Credits Display */}
        <div className="mt-4 p-3 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200">
          <div className="flex items-center gap-2 mb-1">
            <CreditCard className="w-4 h-4 text-slate-500" />
            <span className="text-xs text-slate-500">
              {language === "zh" ? "我的积分" : "My Credits"}
            </span>
          </div>
          <div className="text-2xl font-bold text-slate-800">520</div>
        </div>
      </nav>
    </aside>
  );
}
