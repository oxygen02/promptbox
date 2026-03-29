"use client";

import { useState, useEffect, useRef } from "react";
import {
  Upload,
  Sparkles,
  Copy,
  Star,
  Download,
  Share2,
  Check,
  ChevronDown,
  X,
  RefreshCw,
  CheckCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

type ContentType = "text" | "image" | "video" | "web";
type Language = "zh" | "en";
type Model = "deepseek" | "kimi" | "minimax";

const TAG_OPTIONS: Record<ContentType, string[]> = {
  text: ["通用创作", "ChatGPT长文本", "Claude合规", "核心观点", "文案逻辑", "短视频脚本", "PPT大纲", "营销转化", "学术润色", "代码文档"],
  image: ["Midjourney", "DALL-E 3", "Stable Diffusion", "风格提取", "色彩搭配", "构图光影", "电商商品", "海报文案", "插画创作", "摄影参数"],
  video: ["Pika", "Runway Gen-4", "可灵AI", "运镜转场", "画面风格", "字幕口播", "剧情脚本", "分镜设计", "BGM匹配", "AI剪辑"],
  web: ["V0建站", "Framed网页", "结构组件", "设计配色", "交互逻辑", "React组件", "响应式适配", "SEO优化", "Landing Page", "组件库"],
};

const MODELS: { key: Model; name: string; region: string }[] = [
  { key: "deepseek", name: "DeepSeek", region: "Global" },
  { key: "kimi", name: "Kimi", region: "CN" },
  { key: "minimax", name: "MiniMax", region: "CN" },
];

// 社交平台 - 使用原生图标
const SOCIAL_PLATFORMS = {
  zh: [
    { key: "wechat", name: "微信", svg: <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M8.5 6.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5S7 8.83 7 8s.67-1.5 1.5-1.5zm7 0c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5.67-1.5 1.5-1.5zm-7 9c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5.67-1.5 1.5-1.5zm7 0c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5.67-1.5 1.5-1.5zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>, color: "bg-green-500 hover:bg-green-600" },
    { key: "xiaohongshu", name: "小红书", svg: <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.5 14h-9v-1c0-1.5 2-2.5 4.5-2.5s4.5 1 4.5 2.5v1zm-2.5-4c-1.93 0-3.5 1.57-3.5 3.5v1.5h7v-1.5c0-1.93-1.57-3.5-3.5-3.5z"/></svg>, color: "bg-red-500 hover:bg-red-600" },
    { key: "douyin", name: "抖音", svg: <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M12 2c-1.83 0-3.53.5-5 1.35v11.3C7.47 16.5 5.27 18 2 18v2h4.5v-6.5h-2v3c0 1.1.9 2 2 2h3v5c-1.5-.5-2.5-1.83-2.5-3.5V7c1.1-.45 2.3-.7 3.5-.7s2.4.25 3.5.7v3c0 1.67 1 3 2.5 3.5v5H22v-2c-3.27 0-5.47-1.5-7-5.35V3.35C15.53 2.5 13.83 2 12 2z"/></svg>, color: "bg-gray-800 hover:bg-gray-900" },
  ],
  en: [
    { key: "youtube", name: "YouTube", svg: <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>, color: "bg-red-600 hover:bg-red-700" },
    { key: "tiktok", name: "TikTok", svg: <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93v6.16c0 2.52-1.12 4.84-3.11 6.24-2.22 1.57-5.17 1.56-7.35-.03-2.01-1.47-3.22-4.01-3.22-6.64V3.17c.75.85 1.73 1.54 2.87 1.95 1.2.43 2.48.54 3.71.28V.02z"/></svg>, color: "bg-black hover:bg-gray-800" },
    { key: "facebook", name: "Facebook", svg: <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>, color: "bg-blue-600 hover:bg-blue-700" },
    { key: "linkedin", name: "LinkedIn", svg: <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>, color: "bg-blue-700 hover:bg-blue-800" },
    { key: "twitter", name: "Twitter/X", svg: <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>, color: "bg-black hover:bg-gray-800" },
  ],
};

export default function HomePage() {
  const [language, setLanguage] = useState<Language>("zh");
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
        newPrompts[Number(index)] = `【${modelInfo?.name}】分析维度：${selectedDimensions.join('、')}。生成专业提示词内容...`;
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
    
    const content = `【${MODELS.find(m => m.key === selectedGenModel)?.name}】基于选择的提示词，生成以下创意内容：

1. 标题：xxx
2. 正文内容：xxx
3. 结尾引导：xxx

这是一段AI生成的创意内容示例。`;
    
    setGeneratedContent(content);
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

  const currentTags = TAG_OPTIONS[contentType];
  const displayTags = currentTags.slice(0, 10);
  const socialPlatforms = SOCIAL_PLATFORMS[language];
  const selectedCount = Object.values(cardModels).filter(Boolean).length;

  return (
    <div className="max-w-5xl mx-auto pb-8 relative">
      {/* 动态背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-20 -left-32 w-96 h-96 bg-gradient-to-br from-slate-200/40 to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 -right-32 w-80 h-80 bg-gradient-to-tl from-slate-300/30 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-slate-100/50 to-transparent rounded-full blur-3xl" />
      </div>

      {/* 内容区域 */}
      <div className="relative z-10">
        {/* 内容分类切换 */}
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

        {/* 上传内容 */}
        <div className="glass-card rounded-xl p-4 mb-3">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-700">上传内容</h3>
            <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-600 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              AI Ready
            </span>
          </div>

          <div className="flex gap-3 mb-3">
            {/* 拖拽上传 - 呼吸动画 */}
            <div className="flex-1">
              <label className="block upload-zone py-6 h-full flex flex-col items-center justify-center min-h-[90px] cursor-pointer animate-breathe">
                <Upload className="w-6 h-6 text-slate-400 mb-2" />
                <p className="text-sm text-slate-500">拖拽或点击上传文件</p>
                <input type="file" className="hidden" id="file-upload" />
              </label>
            </div>
            
            <div className="flex-1">
              <input
                type="text"
                placeholder="请输入网页链接 URL"
                value={uploadUrl}
                onChange={(e) => setUploadUrl(e.target.value)}
                className="input-field w-full text-sm py-3"
              />
            </div>
          </div>

          {/* 提示词维度 */}
          <div>
            <h4 className="text-sm font-medium text-slate-600 mb-2">提示词维度（可多选）</h4>
            <div className="grid grid-cols-5 gap-2">
              {displayTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleDimensionClick(tag)}
                  className={cn(
                    "px-2 py-2 text-sm rounded-lg transition-all text-center font-medium",
                    selectedDimensions.includes(tag)
                      ? "bg-slate-700 text-white shadow-md"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 border border-transparent"
                  )}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 三个模型提示词卡片 */}
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
                    className="w-full flex items-center justify-between px-3 py-2 text-sm bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                  >
                    <span className={model ? "text-slate-700 font-medium" : "text-slate-400"}>
                      {model ? modelInfo?.name : "选择模型"}
                    </span>
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  </button>

                  {openDropdown === index && (
                    <div className="dropdown-menu" style={{ left: 0, right: 0 }}>
                      <div
                        className={cn("dropdown-item", !model && "active")}
                        onClick={() => handleCardModelSelect(index, null)}
                      >
                        — 未选中 —
                      </div>
                      {MODELS.map((m) => (
                        <div
                          key={m.key}
                          className={cn("dropdown-item", model === m.key && "active")}
                          onClick={() => handleCardModelSelect(index, m.key)}
                        >
                          {m.name} ({m.region})
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-3 min-h-[80px] text-sm text-slate-600 whitespace-pre-wrap">
                  {prompt || "等待生成..."}
                </div>

                {prompt && (
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
                    <button onClick={() => handleShare(prompt)} className="p-1.5 hover:bg-slate-100 rounded">
                      <Share2 className="w-4 h-4 text-slate-400" />
                    </button>
                    <button className="p-1.5 hover:bg-slate-100 rounded">
                      <Copy className="w-4 h-4 text-slate-400" />
                    </button>
                    <button className="p-1.5 hover:bg-slate-100 rounded">
                      <Star className="w-4 h-4 text-slate-400" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 开始分析按钮 + 积分 - 左侧对齐 */}
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || selectedCount === 0}
            className={cn(
              "flex items-center gap-2 text-sm px-5 py-2.5 rounded-lg font-medium transition-all",
              selectedCount > 0 && !isAnalyzing
                ? "bg-slate-700 text-white hover:bg-slate-800 shadow-lg"
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            )}
          >
            {isAnalyzing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            开始分析
          </button>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-lg">
            <Sparkles className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-sm font-medium text-slate-600">{credits}</span>
          </div>
        </div>

        {/* 提示词编辑框 */}
        <div className="glass-card rounded-xl p-4 mb-3">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-700">提示词编辑</h3>
            <div className="flex gap-2">
              <button className="text-xs px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1">
                <Copy className="w-3 h-3" />
              </button>
              <button className="text-xs px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1">
                <Star className="w-3 h-3" />
              </button>
            </div>
          </div>
          <textarea
            className="input-field min-h-[100px] resize-none text-sm"
            placeholder="编辑提示词..."
          />
          <div className="text-xs text-slate-400 mt-2">0 字符</div>
        </div>

        {/* 创意生成 + 模型选择 + 积分 - 左侧对齐 */}
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={handleCreativeGenerate}
            disabled={!selectedGenModel || isGenerating}
            className={cn(
              "flex items-center gap-2 text-sm px-5 py-2.5 rounded-lg font-medium transition-all",
              selectedGenModel && !isGenerating
                ? "bg-slate-700 text-white hover:bg-slate-800 shadow-lg"
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            )}
          >
            {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            创意生成
          </button>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setOpenGenDropdown(!openGenDropdown)}
              className="flex items-center gap-2 px-4 py-2.5 text-sm bg-white border border-slate-300 rounded-lg hover:bg-slate-50 font-medium text-slate-700"
            >
              {selectedGenModel ? (
                <>{MODELS.find(m => m.key === selectedGenModel)?.name}</>
              ) : (
                <span className="text-slate-400">选择模型</span>
              )}
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>

            {openGenDropdown && (
              <div className="dropdown-menu" style={{ left: 0, minWidth: '160px' }}>
                {MODELS.map((m) => (
                  <div
                    key={m.key}
                    className={cn("dropdown-item", selectedGenModel === m.key && "active")}
                    onClick={() => { setSelectedGenModel(m.key); setOpenGenDropdown(false); }}
                  >
                    {m.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-lg">
            <Sparkles className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-sm font-medium text-slate-600">余额: {credits}</span>
          </div>
        </div>

        {/* 生成内容输出框 */}
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-700">生成内容</h3>
          </div>
          <div className="min-h-[140px] bg-slate-50 rounded-lg p-4 text-sm text-slate-700 whitespace-pre-wrap mb-3">
            {generatedContent || "点击上方「创意生成」按钮生成内容..."}
          </div>
          
          {/* 社交分享按钮 - 右侧 */}
          <div className="flex items-center justify-end gap-3">
            <div className="flex gap-2">
              {socialPlatforms.map((platform) => (
                <button
                  key={platform.key}
                  className={cn("w-9 h-9 rounded-full flex items-center justify-center text-white transition-transform hover:scale-110", platform.color)}
                  title={platform.name}
                >
                  {platform.svg}
                </button>
              ))}
            </div>
            <div className="flex gap-2 border-l border-slate-200 pl-3">
              <button
                onClick={() => handleShare(generatedContent)}
                disabled={!generatedContent}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors disabled:opacity-50"
              >
                <Share2 className="w-4 h-4" />
                分享
              </button>
              <button
                onClick={handleCopy}
                disabled={!generatedContent}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors disabled:opacity-50"
              >
                {copied ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                {copied ? "已复制" : "复制"}
              </button>
              <button
                onClick={handleDownload}
                disabled={!generatedContent}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                下载
              </button>
            </div>
          </div>
        </div>

        {/* 社交分享弹窗 */}
        {showShare && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setShowShare(false)}>
            <div className="glass-card rounded-xl p-5 w-80" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-slate-700">分享</h3>
                <button onClick={() => setShowShare(false)} className="p-1 hover:bg-slate-100 rounded">
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <div className="flex justify-center gap-4 mb-5">
                {socialPlatforms.map((platform) => (
                  <button
                    key={platform.key}
                    className={cn("w-14 h-14 rounded-full flex items-center justify-center text-white transition-transform hover:scale-110", platform.color)}
                  >
                    {platform.svg}
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className="flex-1 flex items-center justify-center gap-2 text-sm py-2.5 bg-slate-100 hover:bg-slate-200 rounded-lg"
                >
                  {copied ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  {copied ? "已复制" : "复制"}
                </button>
                <button
                  onClick={handleDownload}
                  className="flex-1 flex items-center justify-center gap-2 text-sm py-2.5 bg-slate-100 hover:bg-slate-200 rounded-lg"
                >
                  <Download className="w-4 h-4" />
                  下载
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
