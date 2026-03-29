"use client";

import { useState, useEffect, useRef } from "react";
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



type ContentType = "text" | "image" | "video" | "web";
type Model = "deepseek" | "kimi" | "minimax";

const TAG_OPTIONS: Record<ContentType, string[]> = {
  text: ["通用创作", "ChatGPT长文本", "Claude合规", "核心观点", "文案逻辑", "短视频脚本", "PPT大纲", "营销转化", "学术润色", "代码文档", "小说续写", "公文模板"],
  image: ["Midjourney", "DALL-E 3", "Stable Diffusion", "风格提取", "色彩搭配", "构图光影", "电商商品", "海报文案", "插画创作", "摄影参数", "建筑渲染", "UI设计"],
  video: ["Pika", "Runway Gen-4", "可灵AI", "运镜转场", "画面风格", "字幕口播", "剧情脚本", "分镜设计", "BGM匹配", "AI剪辑", "特效合成", "动态海报"],
  web: ["V0建站", "Framed网页", "结构组件", "设计配色", "交互逻辑", "React组件", "响应式适配", "SEO优化", "Landing Page", "组件库", "后台模板", "电商主题"],
};

const MODELS: { key: Model; name: string; region: string }[] = [
  { key: "deepseek", name: "DeepSeek", region: "Global" },
  { key: "kimi", name: "Kimi", region: "CN" },
  { key: "minimax", name: "MiniMax", region: "CN" },
];

const SOCIAL_PLATFORMS = {
  zh: [
    { key: "wechat", name: "微信", svg: <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178A1.17 1.17 0 014.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178 1.17 1.17 0 01-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 01.598.082l1.584.926a.272.272 0 00.139.045c.133 0 .241-.108.241-.243 0-.06-.023-.118-.039-.177l-.326-1.232a.49.49 0 01.177-.554C23.486 18.466 24.5 16.827 24.5 15.024c0-3.376-3.25-6.092-7.562-6.166zM13.858 12.51c.535 0 .969.44.969.983a.976.976 0 01-.969.984.976.976 0 01-.969-.984c0-.543.434-.983.969-.983zm4.844 0c.535 0 .969.44.969.983a.976.976 0 01-.969.984.976.976 0 01-.969-.984c0-.543.434-.983.969-.983z"/></svg>, color: "bg-green-500 hover:bg-green-600" },
    { key: "xiaohongshu", name: "小红书", svg: <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.05-.2-.06-.06-.16-.04-.23-.02-.1.02-1.59 1.01-4.49 2.98-.42.29-.8.43-1.14.42-.38-.01-1.1-.22-1.64-.4-.66-.23-1.19-.35-1.14-.74.02-.2.29-.41.79-.63 3.12-1.36 5.2-2.26 6.24-2.7 2.97-1.24 3.59-1.45 3.99-1.46.09 0 .28.02.41.12.11.08.14.19.16.27-.01.06.01.24 0 .38z"/></svg>, color: "bg-red-500 hover:bg-red-600" },
    { key: "douyin", name: "抖音", svg: <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/></svg>, color: "bg-black hover:bg-gray-800" },
  ],
  en: [
    { key: "youtube", name: "YouTube", svg: <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>, color: "bg-red-600 hover:bg-red-700" },
    { key: "tiktok", name: "TikTok", svg: <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.55-.52 3.08-1.47 4.31-1.24 1.66-3.25 2.69-5.34 2.88-1.87.2-3.84-.21-5.39-1.3-1.68-1.15-2.81-3.01-3.03-5.02-.23-2.17.35-4.48 1.81-6.13 1.43-1.64 3.59-2.58 5.75-2.66v4.04c-1.28.16-2.46 1.07-2.86 2.33-.33.97-.18 2.12.42 2.96.62.91 1.7 1.46 2.81 1.47 1.18.04 2.34-.53 2.97-1.53.28-.43.43-.94.46-1.45V.02z"/></svg>, color: "bg-black hover:bg-gray-800" },
    { key: "facebook", name: "Facebook", svg: <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>, color: "bg-blue-600 hover:bg-blue-700" },
    { key: "linkedin", name: "LinkedIn", svg: <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>, color: "bg-blue-700 hover:bg-blue-800" },
  ],
};

export default function HomePage() {
  const [contentType, setContentType] = useState<ContentType>("text");
  const [selectedDimensions, setSelectedDimensions] = useState<string[]>([]);
  const [uploadUrl, setUploadUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [credits, setCredits] = useState(520);

  const [cardModels, setCardModels] = useState<Record<number, Model | null>>({
    0: null,
    1: null,
    2: null,
  });

  const [cardPrompts, setCardPrompts] = useState<Record<number, string>>({
    0: "",
    1: "",
    2: "",
  });

  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [openGenDropdown, setOpenGenDropdown] = useState(false);
  const [selectedGenModel, setSelectedGenModel] = useState<Model | null>(null);

  const [showShare, setShowShare] = useState(false);
  const [shareContent, setShareContent] = useState("");
  const [copied, setCopied] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const type = params.get("type");
      if (type && ["text", "image", "video", "web"].includes(type)) {
        setContentType(type as ContentType);
      }
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
        setOpenGenDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDimensionClick = (dim: string) => {
    setSelectedDimensions((prev) =>
      prev.includes(dim) ? prev.filter((d) => d !== dim) : [...prev, dim]
    );
  };

  const handleCardModelSelect = (cardIndex: number, model: Model | null) => {
    setCardModels((prev) => ({ ...prev, [cardIndex]: model }));
    setOpenDropdown(null);
  };

  const handleAnalyze = async () => {
    const selectedCount = Object.values(cardModels).filter(Boolean).length;
    if (selectedCount === 0) return;
    setIsAnalyzing(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const newPrompts: Record<number, string> = {};
    Object.entries(cardModels).forEach(([index, model]) => {
      if (model) {
        const modelInfo = MODELS.find((m) => m.key === model);
        newPrompts[Number(index)] = "【" + modelInfo?.name + "】分析维度：" + selectedDimensions.join('、') + "。";
      }
    });
    setCardPrompts(newPrompts);
    setIsAnalyzing(false);
    setCredits((prev) => Math.max(0, prev - selectedCount * 10));
  };

  const handleCreativeGenerate = async () => {
    if (!selectedGenModel) return;
    setIsGenerating(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setGeneratedContent("【" + MODELS.find(m => m.key === selectedGenModel)?.name + "】生成内容示例...");
    setCredits((prev) => Math.max(0, prev - 10));
    setIsGenerating(false);
  };

  const handleShare = (content: string) => {
    setShareContent(content);
    setShowShare(true);
    setCopied(false);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareContent || generatedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([shareContent || generatedContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "prompt.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const contentTypes = [
    { key: "text", label: "文字文档" },
    { key: "image", label: "图片视觉" },
    { key: "video", label: "视频解构" },
    { key: "web", label: "网页设计" },
  ];

  const uploadTypes = [
    { key: "text", label: "文字", icon: FileText },
    { key: "doc", label: "文档", icon: File },
    { key: "image", label: "图片", icon: Image },
    { key: "video", label: "视频", icon: Video },
  ];

  const currentTags = TAG_OPTIONS[contentType];
  const displayTags = currentTags.slice(0, 12);
  const socialPlatforms = SOCIAL_PLATFORMS.zh;
  const selectedCount = Object.values(cardModels).filter(Boolean).length;

  return (
    <div className="max-w-4xl mx-auto pb-8 relative">
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-20 -left-32 w-96 h-96 bg-gradient-to-br from-slate-200/40 to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 -right-32 w-80 h-80 bg-gradient-to-tl from-slate-300/30 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10">
        <div className="flex gap-2 mb-3">
          {contentTypes.map((type) => (
            <button
              key={type.key}
              onClick={() => setContentType(type.key as ContentType)}
              className={cn(
                "px-3 py-1.5 text-sm font-medium rounded-lg transition-all",
                contentType === type.key
                  ? "bg-slate-700 text-white"
                  : "bg-white/80 text-slate-600 border border-slate-200/50 hover:border-slate-300"
              )}
            >
              {type.label}
            </button>
          ))}
        </div>

        <div className="glass-card rounded-xl p-4 mb-3">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-700">上传内容</h3>
            <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-600 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              AI 就绪
            </span>
          </div>

          <div className="flex justify-center gap-4 mb-3">
            {uploadTypes.map((type) => (
              <button key={type.key} className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                <type.icon className="w-5 h-5 text-slate-500" />
                <span className="text-xs text-slate-600">{type.label}</span>
              </button>
            ))}
          </div>

          <div className="flex gap-3 mb-3">
            <div className="flex-1">
              <label className="block upload-zone py-4 h-full flex flex-col items-center justify-center min-h-[80px] cursor-pointer animate-breathe">
                <Upload className="w-5 h-5 text-slate-400 mb-1" />
                <p className="text-xs text-slate-500">拖拽或点击上传</p>
                <input type="file" className="hidden" />
              </label>
            </div>
            <div className="flex-1">
              <input
                type="text"
                placeholder="请输入网页链接 URL"
                value={uploadUrl}
                onChange={(e) => setUploadUrl(e.target.value)}
                className="input-field w-full text-sm py-2.5"
              />
            </div>
          </div>

          <div>
            <h4 className="text-xs font-medium text-slate-500 mb-1.5">提示词维度（可多选）</h4>
            <div className="grid grid-cols-6 gap-1">
              {displayTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleDimensionClick(tag)}
                  className={cn(
                    "px-1.5 py-1 text-xs rounded transition-all text-center",
                    selectedDimensions.includes(tag)
                      ? "bg-slate-700 text-white shadow"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  )}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-3">
          {[0, 1, 2].map((index) => {
            const model = cardModels[index];
            const prompt = cardPrompts[index];
            const modelInfo = MODELS.find((m) => m.key === model);
            return (
              <div key={index} className="glass-card rounded-xl p-3 relative">
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setOpenDropdown(openDropdown === index ? null : index)}
                    className="w-full flex items-center justify-between px-2 py-1.5 text-xs bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                  >
                    <span className={model ? "text-slate-700 font-medium" : "text-slate-400"}>
                      {model ? modelInfo?.name : "选择模型"}
                    </span>
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </button>
                  {openDropdown === index && (
                    <div className="dropdown-menu" style={{ left: 0, right: 0 }}>
                      <div className={cn("dropdown-item", !model && "active")} onClick={() => handleCardModelSelect(index, null)}>— 未选中 —</div>
                      {MODELS.map((m) => (
                        <div key={m.key} className={cn("dropdown-item", model === m.key && "active")} onClick={() => handleCardModelSelect(index, m.key)}>{m.name} ({m.region})</div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="mt-2 min-h-[60px] text-xs text-slate-600 whitespace-pre-wrap">{prompt || "等待生成..."}</div>
                {prompt && (
                  <div className="flex items-center gap-1 mt-2 pt-2 border-t border-slate-100">
                    <button onClick={() => handleShare(prompt)} className="p-1 hover:bg-slate-100 rounded"><Share2 className="w-3 h-3 text-slate-400" /></button>
                    <button className="p-1 hover:bg-slate-100 rounded"><Copy className="w-3 h-3 text-slate-400" /></button>
                    <button className="p-1 hover:bg-slate-100 rounded"><Star className="w-3 h-3 text-slate-400" /></button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || selectedCount === 0}
              className={cn(
                "text-base px-7 py-2.5 rounded-xl font-bold transition-all shadow-xl animate-pulse-glow",
                selectedCount > 0 && !isAnalyzing 
                  ? "bg-gradient-to-r from-slate-700 to-slate-900 text-white hover:from-slate-800 hover:to-slate-950" 
                  : "bg-slate-300 text-slate-500 cursor-not-allowed animate-none"
              )}
            >
              {isAnalyzing ? "分析中..." : "开始分析"}
            </button>
            <div className="flex items-center gap-1">
              <span className="text-xs font-bold text-amber-500">Credit</span>
              <span className="text-base font-bold text-slate-800">{credits}</span>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-xl p-3 mb-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-slate-700">提示词编辑</h3>
            <div className="flex gap-1">
              <button className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded"><Copy className="w-3.5 h-3.5 text-slate-500" /></button>
              <button className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded"><Star className="w-3.5 h-3.5 text-slate-500" /></button>
            </div>
          </div>
          <textarea className="input-field min-h-[60px] resize-none text-xs" placeholder="编辑提示词..." />
          <div className="text-xs text-slate-400 mt-1">0 字符</div>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <button 
              onClick={handleCreativeGenerate} 
              disabled={!selectedGenModel || isGenerating} 
              className={cn(
                "text-base px-7 py-2.5 rounded-xl font-bold transition-all shadow-xl",
                selectedGenModel && !isGenerating 
                  ? "bg-gradient-to-r from-slate-700 to-slate-900 text-white hover:from-slate-800 hover:to-slate-950" 
                  : "bg-slate-300 text-slate-500 cursor-not-allowed"
              )}
            >
              {isGenerating ? "生成中..." : "创意生成"}
            </button>
            <div className="relative" ref={dropdownRef}>
              <button onClick={() => setOpenGenDropdown(!openGenDropdown)} className="flex items-center gap-2 px-4 py-2.5 text-sm bg-white border-2 border-slate-300 rounded-xl hover:bg-slate-50 font-semibold text-slate-700">
                {selectedGenModel ? <>{MODELS.find(m => m.key === selectedGenModel)?.name}</> : <span className="text-slate-400">选择模型</span>}
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>
              {openGenDropdown && (
                <div className="dropdown-menu" style={{ left: 0, minWidth: '140px' }}>
                  {MODELS.map((m) => (<div key={m.key} className={cn("dropdown-item", selectedGenModel === m.key && "active")} onClick={() => { setSelectedGenModel(m.key); setOpenGenDropdown(false); }}>{m.name}</div>))}
                </div>
              )}
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs font-bold text-amber-500">Credit</span>
              <span className="text-base font-bold text-slate-800">{credits}</span>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-700">生成内容</h3>
          </div>
          <div className="min-h-[120px] bg-slate-50 rounded-lg p-3 text-sm text-slate-700 whitespace-pre-wrap mb-3">
            {generatedContent || "点击上方「创意生成」按钮生成内容..."}
          </div>
          <div className="flex items-center justify-end gap-2">
            <div className="flex gap-2">
              {socialPlatforms.map((platform) => (
                <button key={platform.key} className={cn("w-8 h-8 rounded-full flex items-center justify-center text-white transition-transform hover:scale-110", platform.color)} title={platform.name}>{platform.svg}</button>
              ))}
            </div>
            <div className="flex gap-1 border-l border-slate-200 pl-2">
              <button onClick={() => handleShare(generatedContent)} disabled={!generatedContent} className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded transition-colors disabled:opacity-50"><Share2 className="w-4 h-4 text-slate-500" /></button>
              <button onClick={handleCopy} disabled={!generatedContent} className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded transition-colors disabled:opacity-50">{copied ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-slate-500" />}</button>
              <button onClick={handleDownload} disabled={!generatedContent} className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded transition-colors disabled:opacity-50"><Download className="w-4 h-4 text-slate-500" /></button>
            </div>
          </div>
        </div>

        {showShare && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setShowShare(false)}>
            <div className="glass-card rounded-xl p-5 w-80" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-slate-700">分享</h3>
                <button onClick={() => setShowShare(false)} className="p-1 hover:bg-slate-100 rounded"><X className="w-5 h-5 text-slate-400" /></button>
              </div>
              <div className="flex justify-center gap-4 mb-5">
                {socialPlatforms.map((platform) => (<button key={platform.key} className={cn("w-12 h-12 rounded-full flex items-center justify-center text-white transition-transform hover:scale-110", platform.color)}>{platform.svg}</button>))}
              </div>
              <div className="flex gap-2">
                <button onClick={handleCopy} className="flex-1 flex items-center justify-center gap-2 text-sm py-2 bg-slate-100 hover:bg-slate-200 rounded-lg">{copied ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}{copied ? "已复制" : "复制"}</button>
                <button onClick={handleDownload} className="flex-1 flex items-center justify-center gap-2 text-sm py-2 bg-slate-100 hover:bg-slate-200 rounded-lg"><Download className="w-4 h-4" />下载</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
