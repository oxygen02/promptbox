"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
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
import { Button } from "@/components/ui/button";
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
  { key: "deepseek", name: "DeepSeek", nameEn: "DeepSeek", region: "全球", color: "bg-blue-500" },
  { key: "kimi", name: "Kimi", nameEn: "Kimi", region: "国内", color: "bg-indigo-500" },
  { key: "minimax", name: "MiniMax", nameEn: "MiniMax", region: "国内", color: "bg-purple-500" },
];

// 社交平台配置
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
  const searchParams = useSearchParams();
  const [language, setLanguage] = useState<Language>("zh");
  const [contentType, setContentType] = useState<ContentType>((searchParams.get("type") as ContentType) || "text");
  const [selectedDimensions, setSelectedDimensions] = useState<string[]>([]);
  const [uploadContent, setUploadContent] = useState("");
  const [uploadUrl, setUploadUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [credits, setCredits] = useState(520);

  // 每个卡片的模型选择
  const [cardModels, setCardModels] = useState<Record<number, Model | null>>({
    0: null,
    1: null,
    2: null,
  });

  // 每个卡片的提示词
  const [cardPrompts, setCardPrompts] = useState<Record<number, string>>({
    0: "",
    1: "",
    2: "",
  });

  // 下拉菜单状态
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [openGenDropdown, setOpenGenDropdown] = useState(false);

  // 选中的生成模型
  const [selectedGenModel, setSelectedGenModel] = useState<Model | null>(null);

  // 社交分享弹窗
  const [showShare, setShowShare] = useState(false);
  const [sharePrompt, setSharePrompt] = useState("");
  const [copied, setCopied] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const type = searchParams.get("type") as ContentType;
    if (type && ["text", "image", "video", "web"].includes(type)) {
      setContentType(type);
    }
  }, [searchParams]);

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
    if (!uploadContent && !uploadUrl) return;
    
    const selectedCount = Object.values(cardModels).filter(Boolean).length;
    if (selectedCount === 0) return;

    setIsAnalyzing(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const newPrompts: Record<number, string> = {};
    Object.entries(cardModels).forEach(([index, model]) => {
      if (model) {
        const modelInfo = MODELS.find((m) => m.key === model);
        newPrompts[Number(index)] = `【${modelInfo?.name}】基于上传的${contentType === 'text' ? '文字内容' : contentType === 'image' ? '图片' : contentType === 'video' ? '视频' : '网页'}，请分析：${selectedDimensions.join('、')}。生成专业提示词。`;
      }
    });

    setCardPrompts(newPrompts);
    setIsAnalyzing(false);
    setCredits((prev) => Math.max(0, prev - selectedCount * 10));
  };

  const handleCreativeGenerate = async () => {
    if (!selectedGenModel) return;
    setIsGenerating(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
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
    { key: "text", label: "文字文档", icon: "📄" },
    { key: "image", label: "图片视觉", icon: "🖼️" },
    { key: "video", label: "视频解构", icon: "🎬" },
    { key: "web", label: "网页设计", icon: "🌐" },
  ];

  const currentTags = TAG_OPTIONS[contentType];
  const socialPlatforms = SOCIAL_PLATFORMS[language];

  return (
    <div className="max-w-5xl mx-auto pb-8">
      {/* 内容分类切换 */}
      <div className="flex gap-2 mb-3">
        {contentTypes.map((type) => (
          <button
            key={type.key}
            onClick={() => setContentType(type.key as ContentType)}
            className={cn(
              "px-2.5 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5",
              contentType === type.key
                ? "bg-slate-700 text-white"
                : "bg-white text-slate-500 border border-slate-200 hover:border-slate-300"
            )}
          >
            <span>{type.icon}</span>
            {type.label}
          </button>
        ))}
      </div>

      {/* 上传内容（紧凑） */}
      <div className="glass-card rounded-xl p-3 mb-3">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-slate-700">{language === "zh" ? "上传内容" : "Upload"}</h3>
          <span className="text-xs px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5" />
            AI
          </span>
        </div>

        <div className="flex gap-2 mb-2">
          <div className="upload-zone flex-1 py-3">
            <Upload className="w-4 h-4 mx-auto text-slate-400 mb-1" />
            <p className="text-xs text-slate-400">{language === "zh" ? "拖拽上传" : "Upload"}</p>
          </div>
          <input
            type="text"
            placeholder={language === "zh" ? "或链接..." : "Or URL..."}
            value={uploadUrl}
            onChange={(e) => setUploadUrl(e.target.value)}
            className="input-field flex-1 text-xs py-2"
          />
        </div>

        {/* 分析维度 */}
        <div>
          <div className="flex flex-wrap gap-1">
            {currentTags.slice(0, 6).map((tag) => (
              <button
                key={tag}
                onClick={() => handleDimensionClick(tag)}
                className={cn(
                  "px-1.5 py-0.5 text-xs rounded transition-all",
                  selectedDimensions.includes(tag)
                    ? "bg-blue-500 text-white"
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
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
              {/* 模型选择下拉 */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setOpenDropdown(openDropdown === index ? null : index)}
                  className="w-full flex items-center justify-between px-2 py-1.5 text-xs bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                >
                  <span className={model ? `text-slate-700` : `text-slate-400`}>
                    {model ? modelInfo?.name : (language === "zh" ? "选择模型" : "Select model")}
                  </span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {openDropdown === index && (
                  <div className="dropdown-menu" style={{ left: 0, right: 0 }}>
                    <div
                      className={cn("dropdown-item", !model && "active")}
                      onClick={() => handleCardModelSelect(index, null)}
                    >
                      {language === "zh" ? "— 未选中 —" : "— None —"}
                    </div>
                    {MODELS.map((m) => (
                      <div
                        key={m.key}
                        className={cn("dropdown-item", model === m.key && "active")}
                        onClick={() => handleCardModelSelect(index, m.key)}
                      >
                        <span className={cn("w-2 h-2 rounded-full inline-block mr-2", m.color)} />
                        {language === "zh" ? m.name : m.nameEn} ({m.region})
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 提示词内容 */}
              <div className="mt-2 min-h-[60px] text-xs text-slate-600 whitespace-pre-wrap">
                {prompt || (language === "zh" ? "等待生成..." : "Waiting...")}
              </div>

              {/* 操作按钮 */}
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
          disabled={isAnalyzing || (!uploadContent && !uploadUrl) || !Object.values(cardModels).some(Boolean)}
          className="btn-primary flex items-center gap-1.5 text-xs px-3 py-1.5"
        >
          {isAnalyzing ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
          {language === "zh" ? "开始分析" : "Analyze"}
        </button>
        <div className="flex items-center gap-1 px-2 py-1 bg-amber-50 border border-amber-200 rounded">
          <Sparkles className="w-3 h-3 text-amber-500" />
          <span className="text-xs font-medium text-amber-600">{credits}</span>
        </div>
      </div>

      {/* 提示词编辑框 */}
      <div className="glass-card rounded-xl p-3 mb-3">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-slate-700">{language === "zh" ? "提示词编辑" : "Edit Prompt"}</h3>
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
          placeholder={language === "zh" ? "编辑提示词..." : "Edit prompt..."}
        />
        <div className="text-xs text-slate-400 mt-1">0 {language === "zh" ? "字符" : "chars"}</div>
      </div>

      {/* 创意生成 */}
      <div className="glass-card rounded-xl p-3">
        <div className="flex items-center gap-2">
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
                <span className="text-slate-400">{language === "zh" ? "选择模型" : "Select"}</span>
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
                    {language === "zh" ? m.name : m.nameEn}
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={handleCreativeGenerate}
            disabled={!selectedGenModel || isGenerating}
            className="btn-primary flex items-center gap-1.5 text-xs px-3 py-1.5"
          >
            {isGenerating ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
            {language === "zh" ? "创意生成" : "Generate"}
          </button>
        </div>
      </div>

      {/* 社交分享弹窗 */}
      {showShare && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowShare(false)}>
          <div className="glass-card rounded-xl p-4 w-80" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-700">{language === "zh" ? "分享" : "Share"}</h3>
              <button onClick={() => setShowShare(false)} className="p-1 hover:bg-slate-100 rounded">
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            {/* 社交平台 */}
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

            {/* 复制/下载 */}
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className="flex-1 btn-secondary flex items-center justify-center gap-1 text-xs py-2"
              >
                {copied ? <CheckCircle className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                {copied ? (language === "zh" ? "已复制" : "Copied") : (language === "zh" ? "复制" : "Copy")}
              </button>
              <button
                onClick={handleDownload}
                className="flex-1 btn-secondary flex items-center justify-center gap-1 text-xs py-2"
              >
                <Download className="w-3 h-3" />
                {language === "zh" ? "下载" : "Download"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
