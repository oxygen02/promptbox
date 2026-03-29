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

const MODELS: { key: Model; name: string; nameEn: string; region: string; color: string }[] = [
  { key: "deepseek", name: "DeepSeek", nameEn: "DeepSeek", region: "Global", color: "bg-blue-500" },
  { key: "kimi", name: "Kimi", nameEn: "Kimi", region: "CN", color: "bg-indigo-500" },
  { key: "minimax", name: "MiniMax", nameEn: "MiniMax", region: "CN", color: "bg-purple-500" },
];

const SOCIAL_PLATFORMS = {
  zh: [
    { key: "wechat", name: "微信", icon: "💬", color: "bg-green-500" },
    { key: "weibo", name: "微博", icon: "🌐", color: "bg-red-500" },
    { key: "douyin", name: "抖音", icon: "🎵", color: "bg-black" },
  ],
  en: [
    { key: "twitter", name: "Twitter/X", icon: "𝕏", color: "bg-black" },
    { key: "facebook", name: "Facebook", icon: "f", color: "bg-blue-600" },
    { key: "instagram", name: "Instagram", icon: "📷", color: "bg-pink-500" },
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
  const [sharePrompt, setSharePrompt] = useState("");
  const [copied, setCopied] = useState(false);

  // 生成的内容
  const [generatedContent, setGeneratedContent] = useState("");

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 从URL读取type参数
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
    setGeneratedContent(`基于选择的模型 ${MODELS.find(m => m.key === selectedGenModel)?.name}，生成的内容将显示在这里...\n\n这是一段示例生成内容，包含了根据提示词AI生成的实际内容展示。`);
    setIsGenerating(false);
  };

  const handleShare = (prompt: string) => {
    setSharePrompt(prompt);
    setShowShare(true);
    setCopied(false);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(sharePrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([sharePrompt], { type: "text/plain" });
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
  const socialPlatforms = SOCIAL_PLATFORMS[language];
  const selectedCount = Object.values(cardModels).filter(Boolean).length;

  return (
    <div className="max-w-5xl mx-auto pb-8">
      {/* 内容分类切换 */}
      <div className="flex gap-2 mb-3">
        {contentTypes.map((type) => (
          <button
            key={type.key}
            onClick={() => setContentType(type.key as ContentType)}
            className={cn(
              "px-3 py-1.5 text-xs font-medium rounded-lg transition-all",
              contentType === type.key
                ? "bg-slate-700 text-white"
                : "bg-white text-slate-500 border border-slate-200 hover:border-slate-300"
            )}
          >
            {type.label}
          </button>
        ))}
      </div>

      {/* 上传内容 */}
      <div className="glass-card rounded-xl p-3 mb-3">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-slate-700">上传内容</h3>
          <span className="text-xs px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5" />
            AI
          </span>
        </div>

        <div className="flex gap-2 mb-3">
          {/* 拖拽上传 - 居中 */}
          <div className="flex-1">
            <div className="upload-zone py-4 h-full flex flex-col items-center justify-center min-h-[80px]">
              <Upload className="w-5 h-5 text-slate-400 mb-1" />
              <p className="text-xs text-slate-400">拖拽或点击上传文件</p>
              <input type="file" className="hidden" id="file-upload" />
            </div>
          </div>
          
          {/* URL输入 */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="请输入网页链接 URL"
              value={uploadUrl}
              onChange={(e) => setUploadUrl(e.target.value)}
              className="input-field w-full text-xs py-3"
            />
          </div>
        </div>

        {/* 提示词维度 */}
        <div>
          <h4 className="text-xs font-medium text-slate-500 mb-2">提示词维度：</h4>
          <div className="flex flex-wrap gap-1.5">
            {currentTags.slice(0, 6).map((tag) => (
              <button
                key={tag}
                onClick={() => handleDimensionClick(tag)}
                className={cn(
                  "px-2 py-1 text-xs rounded transition-all",
                  selectedDimensions.includes(tag)
                    ? "bg-blue-500 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                )}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 三个模型提示词卡片 */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        {[0, 1, 2].map((index) => {
          const model = cardModels[index];
          const prompt = cardPrompts[index];
          const modelInfo = MODELS.find((m) => m.key === model);

          return (
            <div key={index} className="glass-card rounded-xl p-2.5 relative">
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setOpenDropdown(openDropdown === index ? null : index)}
                  className="w-full flex items-center justify-between px-2 py-1.5 text-xs bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                >
                  <span className={model ? "text-slate-700" : "text-slate-400"}>
                    {model ? modelInfo?.name : "选择模型"}
                  </span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
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
                        <span className={cn("w-2 h-2 rounded-full inline-block mr-2", m.color)} />
                        {m.name} ({m.region})
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-2 min-h-[60px] text-xs text-slate-600 whitespace-pre-wrap">
                {prompt || "等待生成..."}
              </div>

              {prompt && (
                <div className="flex items-center gap-1 mt-2 pt-2 border-t border-slate-100">
                  <button onClick={() => handleShare(prompt)} className="p-1 hover:bg-slate-100 rounded">
                    <Share2 className="w-3 h-3 text-slate-400" />
                  </button>
                  <button className="p-1 hover:bg-slate-100 rounded">
                    <Copy className="w-3 h-3 text-slate-400" />
                  </button>
                  <button className="p-1 hover:bg-slate-100 rounded">
                    <Star className="w-3 h-3 text-slate-400" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 开始分析按钮 */}
      <div className="flex items-center gap-2 mb-3">
        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing || selectedCount === 0}
          className="btn-primary flex items-center gap-1.5 text-xs px-3 py-1.5"
        >
          {isAnalyzing ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
          开始分析
        </button>
        <div className="flex items-center gap-1 px-2 py-1 bg-amber-50 border border-amber-200 rounded">
          <Sparkles className="w-3 h-3 text-amber-500" />
          <span className="text-xs font-medium text-amber-600">{credits}</span>
        </div>
      </div>

      {/* 提示词编辑框 */}
      <div className="glass-card rounded-xl p-3 mb-3">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-slate-700">提示词编辑</h3>
          <div className="flex gap-1">
            <button className="text-xs px-2 py-1 bg-slate-100 rounded hover:bg-slate-200 flex items-center gap-1">
              <Copy className="w-3 h-3" />
            </button>
            <button className="text-xs px-2 py-1 bg-slate-100 rounded hover:bg-slate-200 flex items-center gap-1">
              <Star className="w-3 h-3" />
            </button>
          </div>
        </div>
        <textarea
          className="input-field min-h-[80px] resize-none text-xs"
          placeholder="编辑提示词..."
        />
        <div className="text-xs text-slate-400 mt-1">0 字符</div>
      </div>

      {/* 创意生成 + 模型选择 */}
      <div className="glass-card rounded-xl p-3 mb-3">
        <div className="flex items-center gap-2">
          {/* 创意生成按钮 */}
          <button
            onClick={handleCreativeGenerate}
            disabled={!selectedGenModel || isGenerating}
            className="btn-primary flex items-center gap-1.5 text-xs px-3 py-1.5"
          >
            {isGenerating ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
            创意生成
          </button>

          {/* 模型选择下拉 */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setOpenGenDropdown(!openGenDropdown)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
            >
              {selectedGenModel ? (
                <>
                  <span className={cn("w-2 h-2 rounded-full", MODELS.find(m => m.key === selectedGenModel)?.color)} />
                  {MODELS.find(m => m.key === selectedGenModel)?.name}
                </>
              ) : (
                <span className="text-slate-400">选择模型</span>
              )}
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {openGenDropdown && (
              <div className="dropdown-menu" style={{ left: 0, minWidth: '140px' }}>
                {MODELS.map((m) => (
                  <div
                    key={m.key}
                    className={cn("dropdown-item", selectedGenModel === m.key && "active")}
                    onClick={() => { setSelectedGenModel(m.key); setOpenGenDropdown(false); }}
                  >
                    <span className={cn("w-2 h-2 rounded-full inline-block mr-2", m.color)} />
                    {m.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 生成内容输出框 */}
      {generatedContent && (
        <div className="glass-card rounded-xl p-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-slate-700">生成内容</h3>
            <div className="flex items-center gap-1">
              <button onClick={() => handleShare(generatedContent)} className="p-1.5 hover:bg-slate-100 rounded">
                <Share2 className="w-3.5 h-3.5 text-slate-400" />
              </button>
              <button className="p-1.5 hover:bg-slate-100 rounded">
                <Download className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>
          <div className="min-h-[120px] bg-slate-50 rounded-lg p-3 text-xs text-slate-600 whitespace-pre-wrap">
            {generatedContent}
          </div>
        </div>
      )}

      {/* 社交分享弹窗 */}
      {showShare && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowShare(false)}>
          <div className="glass-card rounded-xl p-4 w-80" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-700">分享</h3>
              <button onClick={() => setShowShare(false)} className="p-1 hover:bg-slate-100 rounded">
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <div className="flex justify-center gap-3 mb-4">
              {socialPlatforms.map((platform) => (
                <button
                  key={platform.key}
                  className={cn("w-10 h-10 rounded-full flex items-center justify-center text-white text-sm", platform.color)}
                >
                  {platform.icon}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className="flex-1 btn-secondary flex items-center justify-center gap-1 text-xs py-2"
              >
                {copied ? <CheckCircle className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                {copied ? "已复制" : "复制"}
              </button>
              <button
                onClick={handleDownload}
                className="flex-1 btn-secondary flex items-center justify-center gap-1 text-xs py-2"
              >
                <Download className="w-3 h-3" />
                下载
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
