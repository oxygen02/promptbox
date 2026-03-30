"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Upload,
  Sparkles,
  Copy,
  Star,
  Download,
  Share2,
  ChevronDown,
  X,
  CheckCircle,
  FileText,
  File,
  Image,
  Video,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Social platform icons
const SocialIcon = ({ platform }: { platform: string }) => {
  const icons: Record<string, React.ReactNode> = {
    // Chinese platforms
    wechat: <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348z"/></svg>,
    weibo: <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.05-.2-.06-.06-.16-.04-.23-.02-.1.02-1.59 1.01-4.49 2.98-.42.29-.8.43-1.14.42-.38-.01-1.1-.22-1.64-.4-.66-.23-1.19-.35-1.14-.74.02-.2.29-.41.79-.63 3.12-1.36 5.2-2.26 6.24-2.7 2.97-1.24 3.59-1.45 3.99-1.46.09 0 .28.02.41.12.11.08.14.19.16.27-.01.06.01.24 0 .38z"/></svg>,
    xiaohongshu: <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/></svg>,
    // International platforms
    x: <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
    facebook: <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>,
    linkedin: <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>,
    instagram: <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>,
    telegram: <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>,
    tiktok: <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93v6.16c0 2.52-1.12 4.84-3.11 6.24-2.22 1.57-5.22 1.3-7.28-1.05-1.95-2.23-2.09-5.79-.45-8.22.82-1.21 2.22-2.08 3.71-2.32v4.14c-.85-.24-1.77-.31-2.65-.21-.51.06-.97.33-1.31.69v-6.04c.39-.42.92-.68 1.53-.73h.18c.52 0 1.01.18 1.41.53.38.33.61.82.61 1.35v4.62c.59-.39 1.28-.59 2-.49.89.13 1.63.79 1.95 1.57.37.9.44 1.94.17 2.86-.27.9-.93 1.6-1.83 1.95-1.05.4-2.24.32-3.22-.36-.71-.5-1.2-1.22-1.45-1.96-.25-.74.02-1.52.69-2.02.79-.59 1.95-.49 2.63.3.53.61.76 1.42.63 2.17-.15.88-.74 1.6-1.59 1.93-1.01.4-2.17.15-3.01-.67-.98-.96-1.26-2.33-.75-3.51.53-1.23 1.82-2.07 3.19-2.08 1.43-.01 2.78.5 3.57 1.51.77.98 1.09 2.27.86 3.51-.22 1.23-.89 2.26-1.84 2.85-.95.59-2.12.67-3.03.21-.9-.45-1.53-1.26-1.75-2.21-.21-.91.13-1.86.9-2.49.88-.72 2.24-.69 3.06.16.78.81.96 2.03.48 3.01-.48.99-1.54 1.65-2.68 1.69-1.24.05-2.4-.52-3.17-1.54-.78-1.04-1.07-2.41-.77-3.64.3-1.23 1.16-2.25 2.38-2.8 1.22-.55 2.7-.53 3.91.07.78.39 1.4.97 1.77 1.68v-4.56c-.8-.63-1.77-.98-2.78-1.01-.64-.02-1.28.08-1.87.3-.59.22-1.1.57-1.49 1-.77.86-1.16 2.07-1.05 3.22.1 1.08.68 2.03 1.56 2.55.9.53 1.99.53 2.9.08.88-.44 1.48-1.21 1.66-2.13.18-.92-.11-1.88-.77-2.54-.68-.68-1.7-.83-2.51-.38z"/></svg>,
  };
  return <>{icons[platform]}</>;
};

type ContentType = "text" | "image" | "video" | "web";
type Model = "deepseek" | "kimi" | "minimax" | "gpt4o" | "claude" | "gemini" | "qwen" | "zhipu" | "yi" | "spark";

const MODELS: { key: Model; name: string; region: string }[] = [
  { key: "deepseek", name: "DeepSeek", region: "Global" },
  { key: "kimi", name: "Kimi", region: "CN" },
  { key: "minimax", name: "MiniMax", region: "CN" },
  { key: "gpt4o", name: "GPT-4o", region: "Global" },
  { key: "claude", name: "Claude 3.5", region: "Global" },
  { key: "gemini", name: "Gemini Pro", region: "Global" },
  { key: "qwen", name: "Qwen", region: "CN" },
  { key: "zhipu", name: "GLM", region: "CN" },
  { key: "yi", name: "Yi", region: "CN" },
  { key: "spark", name: "Spark", region: "CN" },
];

// 国际化文本
const I18N = {
  zh: {
    contentTypes: [
      { key: "text", label: "文字文档" },
      { key: "image", label: "图片视觉" },
      { key: "video", label: "视频解构" },
      { key: "web", label: "网页设计" },
    ],
    tags: {
      text: ["信息提炼", "风格复刻", "结构梳理", "语气定位", "受众适配", "平台适配", "标题优化", "摘要生成", "扩写缩写", "关键词提取", "文案改写", "逻辑优化"],
      image: ["构图分析", "色彩提取", "风格定位", "氛围营造", "光影质感", "主体突出", "细节强化", "场景还原", "元素拆解", "画质优化", "创意延伸", "风格融合"],
      video: ["分镜拆解", "叙事梳理", "节奏控制", "画面风格", "转场特效", "旁白提炼", "场景还原", "镜头语言", "剪辑逻辑", "爆款钩子", "二创重构", "氛围塑造"],
      web: ["布局结构", "配色规范", "字体排版", "交互逻辑", "信息层级", "组件复用", "响应适配", "品牌风格", "体验优化", "视觉引导", "界面复刻", "动效设计"],
    },
    uploadContent: "上传内容",
    aiReady: "AI 就绪",
    selectModel: "选择模型",
    generating: "生成中...",
    creativeGenerate: "创意生成",
    startAnalyze: "开始分析",
    analyzing: "分析中...",
    generatedPlaceholder: "点击上方「创意生成」按钮生成内容...",
    promptDimensions: "提示词维度",
    dragOrClick: "拖拽或点击上传",
    enterUrl: "请输入网页链接 URL",
    promptCards: "提示词卡片",
    waitingGenerate: "等待生成...",
    promptEdit: "提示词编辑",
    editPlaceholder: "编辑提示词...",
    generatedContent: "生成内容",
    share: "分享",
    copied: "已复制",
    download: "下载",
    copyText: "复制",
    uploadTypes: [
      { key: "text", label: "文字" },
      { key: "doc", label: "文档" },
      { key: "image", label: "图片" },
      { key: "video", label: "视频" },
    ],
  },
  en: {
    contentTypes: [
      { key: "text", label: "Text" },
      { key: "image", label: "Image" },
      { key: "video", label: "Video" },
      { key: "web", label: "Web" },
    ],
    tags: {
      text: ["Info Extract", "Style Copy", "Structure", "Tone", "Audience", "Platform", "Title", "Summary", "Expand/Shorten", "Keywords", "Rewrite", "Logic"],
      image: ["Composition", "Color Extract", "Style Locating", "Atmosphere", "Lighting", "Subject Focus", "Details", "Scene Restore", "Elements", "Quality", "Creative Ext", "Style Mix"],
      video: ["Storyboard", "Narrative", "Rhythm", "Visual Style", "Transitions", "Voiceover", "Scene Restore", "Camera Lang", "Editing Logic", "Hook Design", "Adaptation", "Atmosphere"],
      web: ["Layout Structure", "Color Spec", "Typography", "Interaction", "Info Hierarchy", "Components", "Responsive", "Brand Style", "UX", "Visual Guide", "UI Clone", "Animation"],
    },
    uploadContent: "Upload Content",
    aiReady: "AI Ready",
    selectModel: "Select Model",
    generating: "Generating...",
    creativeGenerate: "Generate",
    startAnalyze: "Analyze",
    analyzing: "Analyzing...",
    generatedPlaceholder: "Click 'Generate' button to create content...",
    promptDimensions: "Prompt Dimensions (Multi-select)",
    dragOrClick: "Drag or click to upload",
    enterUrl: "Enter webpage URL",
    promptCards: "Prompt Cards",
    waitingGenerate: "Waiting...",
    promptEdit: "Edit Prompt",
    editPlaceholder: "Edit your prompt...",
    generatedContent: "Generated Content",
    share: "Share",
    copy: "Copy",
    copied: "Copied",
    download: "Download",
    copyText: "Copy",
    uploadTypes: [
      { key: "text", label: "Text" },
      { key: "doc", label: "Doc" },
      { key: "image", label: "Image" },
      { key: "video", label: "Video" },
    ],
  },
};

export default function HomePage() {
  const router = useRouter();
  const pathname = usePathname();
  const [language, setLanguage] = useState<"zh" | "en">("zh");
  const [contentType, setContentType] = useState<ContentType>("text");
  const [selectedDimensions, setSelectedDimensions] = useState<string[]>([]);
  const [uploadUrl, setUploadUrl] = useState("");
  const [pastedContent, setPastedContent] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // 从 URL 读取语言设置，并监听变化
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const lang = params.get("lang");
      if (lang === "zh" || lang === "en") {
        setLanguage(lang);
      }
    }
    
    // 监听语言参数变化
    const handleLangChange = () => {
      const params = new URLSearchParams(window.location.search);
      const lang = params.get("lang");
      if (lang === "zh" || lang === "en") {
        setLanguage(lang);
      }
    };
    
    window.addEventListener("popstate", handleLangChange);
    // 监听 pushState 触发的更新
    const originalPushState = window.history.pushState;
    window.history.pushState = function(...args) {
      originalPushState.apply(window.history, args);
      handleLangChange();
    };
    
    return () => {
      window.removeEventListener("popstate", handleLangChange);
      window.history.pushState = originalPushState;
    };
  }, [pathname]);

  // 监听 Header 触发的语言切换事件
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const handleLanguageChange = (e: CustomEvent) => {
      setLanguage(e.detail);
    };
    
    window.addEventListener("language-change", handleLanguageChange as EventListener);
    return () => window.removeEventListener("language-change", handleLanguageChange as EventListener);
  }, []);

  // 监听 Sidebar 触发的 content-type-change 事件
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const handleContentTypeChange = (e: CustomEvent) => {
      setContentType(e.detail as ContentType);
    };
    
    window.addEventListener("content-type-change", handleContentTypeChange as EventListener);
    return () => window.removeEventListener("content-type-change", handleContentTypeChange as EventListener);
  }, []);

  const t = I18N[language];

  // 处理文件上传
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log("Uploaded file:", file.name);
      // 这里可以添加文件上传逻辑
      alert(`已选择文件: ${file.name}`);
    }
  };
  const [credits] = useState(520);
  const [cardModels, setCardModels] = useState<Record<number, string | null>>({ 0: null, 1: null, 2: null });
  const [promptText, setPromptText] = useState("");
  const [cardPrompts, setCardPrompts] = useState<Record<number, string>>({ 0: "", 1: "", 2: "" });
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [openGenDropdown, setOpenGenDropdown] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  const [selectedGenModel, setSelectedGenModel] = useState<Model | null>(null);
  const [showShare, setShowShare] = useState(false);
  const [shareContent, setShareContent] = useState("");
  const [copied, setCopied] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dropdownPos, setDropdownPos] = useState<{top: number; left: number} | null>(null);
  const [genDropdownPos, setGenDropdownPos] = useState<{top: number; left: number} | null>(null);
  const dropdownButtonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const genDropdownButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    // 从 URL 参数读取内容类型，实现左侧导航联动
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const type = params.get("type");
      if (type && ["text", "image", "video", "web"].includes(type)) {
        setContentType(type as ContentType);
      }
    }
  }, []);



  const handleDimensionClick = (dim: string) => {
    setSelectedDimensions((prev) => prev.includes(dim) ? prev.filter((d) => d !== dim) : [...prev, dim]);
  };

  // 同步内容类型到 URL
  const handleContentTypeChange = (type: ContentType) => {
    setContentType(type);
    // 触发自定义事件，让 Sidebar 更新高亮状态
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("content-type-change", { detail: type }));
      router.push(`/?type=${type}`);
    }
  };

  const handleCardModelSelect = (cardIndex: number, model: string | null) => {
    if (model) {
      // 检查其他卡片是否已选择相同模型
      for (const [idx, m] of Object.entries(cardModels)) {
        if (idx !== String(cardIndex) && m === model) {
          alert(`模型 ${MODELS.find(x => x.key === model)?.name} 已被选择，请选择其他模型`);
          return;
        }
      }
    }
    setCardModels((prev) => ({ ...prev, [cardIndex]: model }));
    setOpenDropdown(null);
  };

  const handleAnalyze = async () => {
    // 检查是否有上传内容或URL
    const content = pastedContent || uploadUrl;
    
    if (!content) {
      alert("请先上传文件、粘贴内容或输入URL后再进行分析");
      return;
    }
    
    // 判断是否为文件上传（文件名格式）
    const isFileUpload = content.startsWith('[文件]');
    
    // 显示分析中状态
    setIsAnalyzing(true);
    setPromptText("正在分析上传的内容...");
    
    // 模拟 AI 分析延迟
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // 获取选中的模型
    const selectedModels = [cardModels[0], cardModels[1], cardModels[2]].filter(Boolean);
    const modelsToUse = selectedModels.length > 0 ? selectedModels : ['deepseek'];
    
    // 获取维度
    const dims = selectedDimensions.length > 0 ? selectedDimensions.join('、') : '通用';
    const contentTypeName = contentType === 'text' ? '文字文档' : contentType === 'image' ? '图片视觉' : contentType === 'video' ? '视频解构' : '网页设计';
    
    // 简单提取内容中的关键信息（模拟 AI 分析）
    const lines = content.split(/[\n，。,.、]/).filter(l => l.trim().length > 2);
    const keyPoints = lines.slice(0, 5).map(l => l.trim()).join('\n');
    const wordCount = content.length;
    const charCount = content.replace(/\s/g, '').length;
    
    // 为每个模型生成基于实际内容的提示词
    const newCardPrompts: Record<number, string> = {};
    const allPrompts: string[] = [];
    
    modelsToUse.forEach((modelKey, idx) => {
      const modelInfo = MODELS.find(m => m.key === modelKey);
      
      // 基于实际内容生成具体可编辑的提示词
      let prompt = '';
      
      if (isFileUpload) {
        // 文件上传的情况 - 提示用户文件已上传但内容无法直接读取
        const fileName = content.replace('[文件] ', '');
        prompt = `# ${modelInfo?.name} 提示词 - 文件分析

## 📁 上传文件信息
- 文件名：${fileName}
- 内容类型：${contentTypeName}
- 分析维度：${dims}

## ⚠️ 注意
上传的是文件格式（.docx/.pdf等），系统暂时无法直接解析文件内容。

## 💡 建议操作
1. 将文件内容复制粘贴到下方
2. 或手动输入文件的主要内容描述
3. 然后基于内容进行提示词生成

## 📋 文件内容（请粘贴在此处）
[请在此处粘贴文件的主要内容...]

## 🎯 分析维度：${dims}
请基于上述内容，按照选定维度进行分析并生成提示词。

## ✏️ 生成的提示词（请编辑此处）
[基于文件内容生成的提示词将显示在这里...]`;
      } else {
        // 文本内容或URL
        const promptContent = content.length > 300 ? content.substring(0, 300) + '...' : content;
        prompt = `# ${modelInfo?.name} 提示词 - 基于内容生成

## 📋 原始内容分析
- 内容类型：${contentTypeName}
- 字数统计：${wordCount} 字 / ${charCount} 字符
- 分析维度：${dims}

## 📄 提取的关键信息
${keyPoints || '（请在此补充关键信息）'}

## 📝 原始内容
\`\`\`
${promptContent}
\`\`\`

## 💡 提示词模板（请编辑）

### 角色设定
你是一位专业的内容分析师。

### 任务
基于上述内容，按照「${dims}」维度进行分析。

### 输出要求
1. 总结核心观点
2. 提取关键信息
3. 生成针对性提示词

### ✏️ 生成的提示词（请编辑此处）
[在此处输入生成的提示词...]`;
      }

      newCardPrompts[idx] = prompt;
      allPrompts.push(prompt);
    });
    
    // 更新状态 - 文本框可编辑
    setPromptText(allPrompts.join('\n\n'));
    setCardModels({ 
      0: modelsToUse[0] || null, 
      1: modelsToUse[1] || null, 
      2: modelsToUse[2] || null 
    });
    setCardPrompts(newCardPrompts);
    setIsAnalyzing(false);
  };

  const handleCreativeGenerate = async () => {
    if (!selectedGenModel) return;
    setIsGenerating(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setGeneratedContent("【" + MODELS.find(m => m.key === selectedGenModel)?.name + "】生成内容示例...");
    setIsGenerating(false);
  };

  const handleShare = (content: string) => { setShareContent(content); setShowShare(true); setCopied(false); };
  const handleCopy = async () => { await navigator.clipboard.writeText(shareContent || generatedContent); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const handleDownload = () => { const blob = new Blob([shareContent || generatedContent], { type: "text/plain" }); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = "prompt.txt"; a.click(); URL.revokeObjectURL(url); };

  const contentTypes = t.contentTypes;
  const uploadTypes = [
    { key: "text", label: t.uploadTypes[0].label, icon: FileText },
    { key: "doc", label: t.uploadTypes[1].label, icon: File },
    { key: "image", label: t.uploadTypes[2].label, icon: Image },
    { key: "video", label: t.uploadTypes[3].label, icon: Video },
  ];
  const currentTags = t.tags[contentType].slice(0, 12);
  const selectedCount = Object.values(cardModels).filter(Boolean).length;

  return (
    <div className="max-w-4xl mx-auto pb-8 relative pt-2">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-slate-200/30 to-transparent rounded-full blur-3xl" />
      </div>
      <div className="relative z-10">
        <div className="flex gap-2 mb-4">
          {contentTypes.map((type) => (
            <button key={type.key} onClick={() => handleContentTypeChange(type.key as ContentType)} className={cn("px-4 py-2 text-sm font-medium rounded-lg transition-all", contentType === type.key ? "bg-slate-800 text-white shadow-lg" : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300")}>{type.label}</button>
          ))}
        </div>
        <div className="glass-card rounded-2xl p-5 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-700">{t.uploadContent}</h3>
            <span className="text-xs px-3 py-1 rounded-full bg-slate-100 text-slate-500 flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5" />{t.aiReady}</span>
          </div>
          
          {/* 左侧：上传区域，右侧：维度选择 */}
          <div className="flex gap-4">
            {/* 左侧：上传区域 */}
            <div className="w-1/2">
              <div 
                className="upload-zone py-4 px-3 flex flex-col justify-center border border-slate-200 rounded-lg bg-white cursor-pointer hover:border-blue-400 min-h-[100px]"
                onClick={() => {
                  const input = document.getElementById('pb-file-input');
                  if (input) input.click();
                }}
                onPaste={(e) => {
                  e.preventDefault();
                  const text = e.clipboardData.getData('text');
                  if (text) {
                    setPastedContent(text);
                  }
                }}
                tabIndex={0}
              >
                <span className="text-sm text-slate-500">{pastedContent || t.dragOrClick}</span>
                <span className="text-xs text-slate-400 mt-1">点击上传或Ctrl+V粘贴</span>
              </div>
              <input type="text" placeholder="输入网页URL" value={uploadUrl} onChange={(e) => setUploadUrl(e.target.value)} className="input-field w-full py-2 text-sm mt-2" />
              
              {/* 用空白占位使左侧高度与右侧维度区域对齐 */}
              <div className="h-[50px]"></div>
              
              <input 
                type="file" 
                id="pb-file-input"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    // 只读取纯文本文件，其他文件显示文件名
                    if (file.type.includes('text') || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
                      const reader = new FileReader();
                      reader.onload = (e) => {
                        const text = e.target?.result as string;
                        setPastedContent(text || '');
                        console.log('文本文件已读取:', file.name, '字数:', text?.length || 0);
                      };
                      reader.onerror = () => {
                        setPastedContent(`[文件] ${file.name} (${(file.size/1024).toFixed(1)} KB)`);
                      };
                      reader.readAsText(file);
                    } else {
                      // 对于 .docx, .pdf, 图片等，只显示文件名
                      setPastedContent(`[文件] ${file.name} (${(file.size/1024).toFixed(1)} KB)`);
                      console.log('非文本文件:', file.name);
                    }
                  }
                }} 
                style={{ display: 'none' }}
                accept="image/*,video/*,.txt,.doc,.docx,.pdf"
              />
            </div>
            
            {/* 右侧：维度选择 */}
            <div className="w-1/2">
              <h4 className="text-xs font-medium text-slate-500 mb-2">{t.promptDimensions}</h4>
              <div className="grid grid-cols-4 gap-1.5">
                {currentTags.map((tag) => (
                  <button 
                    key={tag} 
                    onClick={() => handleDimensionClick(tag)} 
                    className={cn("px-2 py-1.5 text-xs rounded-lg transition-all text-center", selectedDimensions.includes(tag) ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200")}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[0, 1, 2].map((index) => { const model = cardModels[index]; const prompt = cardPrompts[index]; const modelInfo = MODELS.find((m) => m.key === model); return (
            <div key={index} className="glass-card rounded-xl p-4">
              <div className="relative">
                <div className="relative">
                  <select 
                    value={model || ''} 
                    onChange={(e) => handleCardModelSelect(index, e.target.value || null)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none appearance-none cursor-pointer"
                  >
                    <option value="">— 选择模型 —</option>
                    {MODELS.map((m) => (
                      <option key={m.key} value={m.key}>{m.name} ({m.region})</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>
              <div className="mt-3 min-h-[70px] text-sm text-slate-600 whitespace-pre-wrap">{prompt || t.waitingGenerate}</div>
              {prompt && (<div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-slate-100"><button onClick={() => handleShare(prompt)} className="p-1.5 hover:bg-slate-100 rounded-lg"><Share2 className="w-4 h-4 text-slate-400" /></button><button className="p-1.5 hover:bg-slate-100 rounded-lg"><Copy className="w-4 h-4 text-slate-400" /></button><button className="p-1.5 hover:bg-slate-100 rounded-lg"><Star className="w-4 h-4 text-slate-400" /></button></div>)}
            </div>
          );})}
        </div>
        <div className="flex items-center gap-4 mb-4">
          <button onClick={handleAnalyze} disabled={false} className={cn("text-sm px-6 py-2 rounded-xl font-semibold transition-all shadow-lg bg-slate-800 text-white hover:bg-slate-900", selectedCount === 0 && "opacity-50 cursor-not-allowed")}>{isAnalyzing ? t.analyzing : t.startAnalyze}</button>
          <div className="flex items-center gap-2 text-sm"><span className="text-amber-500 font-medium">Credit</span><span className="text-slate-700 font-semibold">{credits}</span></div>
        </div>
        <div className="glass-card rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between mb-3"><h3 className="text-sm font-semibold text-slate-700">{t.promptEdit}</h3><div className="flex gap-1.5"><button className="p-2 bg-slate-50 hover:bg-slate-100 rounded-lg"><Copy className="w-4 h-4 text-slate-400" /></button><button className="p-2 bg-slate-50 hover:bg-slate-100 rounded-lg"><Star className="w-4 h-4 text-slate-400" /></button></div></div>
          <textarea value={promptText} onChange={(e) => setPromptText(e.target.value)} className="input-field min-h-[80px] resize-none" placeholder={t.editPlaceholder} />
          <div className="text-xs text-slate-400 mt-2">0 字符</div>
        </div>
        <div className="flex items-center gap-4 mb-4">
          <button onClick={handleCreativeGenerate} disabled={!selectedGenModel || isGenerating} className={cn("text-sm px-6 py-2 rounded-xl font-semibold transition-all shadow-lg bg-slate-800 text-white hover:bg-slate-900", !selectedGenModel && "opacity-50 cursor-not-allowed")}>{isGenerating ? t.generating : t.creativeGenerate}</button>
          <div className="relative">
            <select 
              value={selectedGenModel || ''} 
              onChange={(e) => setSelectedGenModel(e.target.value || null)}
              className="px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none appearance-none cursor-pointer"
            >
              <option value="">{t.selectModel}</option>
              {MODELS.map((m) => (
                <option key={m.key} value={m.key}>{m.name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
          <div className="flex items-center gap-2 text-sm"><span className="text-amber-500 font-medium">Credit</span><span className="text-slate-700 font-semibold">{credits}</span></div>
        </div>
        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center justify-between mb-4"><h3 className="text-sm font-semibold text-slate-700">{t.generatedContent}</h3></div>
          <div className="min-h-[140px] bg-slate-50 rounded-xl p-4 text-sm text-slate-700 whitespace-pre-wrap mb-4">{generatedContent || t.generatedPlaceholder}</div>
          <div className="flex items-center justify-end gap-3"><div className="flex gap-2">
              <button className="w-9 h-9 rounded-full bg-slate-700 hover:bg-slate-800 flex items-center justify-center text-white"><svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348z"/></svg></button>
              <button className="w-9 h-9 rounded-full bg-slate-700 hover:bg-slate-800 flex items-center justify-center text-white"><svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.05-.2-.06-.06-.16-.04-.23-.02-.1.02-1.59 1.01-4.49 2.98-.42.29-.8.43-1.14.42-.38-.01-1.1-.22-1.64-.4-.66-.23-1.19-.35-1.14-.74.02-.2.29-.41.79-.63 3.12-1.36 5.2-2.26 6.24-2.7 2.97-1.24 3.59-1.45 3.99-1.46.09 0 .28.02.41.12.11.08.14.19.16.27-.01.06.01.24 0 .38z"/></svg></button>
              <button className="w-9 h-9 rounded-full bg-slate-700 hover:bg-slate-800 flex items-center justify-center text-white"><svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/></svg></button>
            </div><div className="flex gap-1.5 border-l border-slate-200 pl-3"><button onClick={() => handleShare(generatedContent)} disabled={!generatedContent} className="p-2 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"><Share2 className="w-4 h-4 text-slate-500" /></button><button onClick={handleCopy} disabled={!generatedContent} className="p-2 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50">{copied ? <CheckCircle className="w-4 h-4 text-slate-500" /> : <Copy className="w-4 h-4 text-slate-500" />}</button><button onClick={handleDownload} disabled={!generatedContent} className="p-2 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"><Download className="w-4 h-4 text-slate-500" /></button></div></div>
        </div>
        {showShare && (<div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" onClick={() => setShowShare(false)}><div className="glass-card rounded-2xl p-6 w-80" onClick={(e) => e.stopPropagation()}><div className="flex items-center justify-between mb-5"><h3 className="text-base font-semibold text-slate-700">{t.share}</h3><button onClick={() => setShowShare(false)} className="p-1.5 hover:bg-slate-100 rounded-lg"><X className="w-5 h-5 text-slate-400" /></button></div><div className="flex justify-center gap-3 mb-5 flex-wrap">
              {(language === "zh" 
                ? ["wechat", "weibo", "xiaohongshu"] 
                : ["x", "facebook", "instagram"]
              ).map((platform) => (
                <button key={platform} className="hover:scale-110 transition-transform">
                  <SocialIcon platform={platform} />
                </button>
              ))}
            </div><div className="flex gap-2"><button onClick={handleCopy} className="flex-1 flex items-center justify-center gap-2 text-sm py-2.5 bg-slate-50 hover:bg-slate-100 rounded-lg">{copied ? <CheckCircle className="w-4 h-4 text-slate-500" /> : <Copy className="w-4 h-4 text-slate-400" />}{copied ? t.copied : t.copyText}</button><button onClick={handleDownload} className="flex-1 flex items-center justify-center gap-2 text-sm py-2.5 bg-slate-50 hover:bg-slate-100 rounded-lg"><Download className="w-4 h-4 text-slate-400" />{t.download}</button></div></div></div>)}
      </div>
    </div>
  );
}
