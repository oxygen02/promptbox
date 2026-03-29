"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  Upload,
  Sparkles,
  Copy,
  Star,
  Download,
  Share2,
  Check,
  AlertCircle,
  Loader2,
  Image as ImageIcon,
  FileText,
  Video,
  Globe,
  X,
  RefreshCw,
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

const MODELS: { key: Model; name: string; region: string; color: string }[] = [
  { key: "deepseek", name: "DeepSeek", region: "全球", color: "bg-blue-500" },
  { key: "kimi", name: "Kimi", region: "国内", color: "bg-indigo-500" },
  { key: "minimax", name: "MiniMax", region: "国内", color: "bg-purple-500" },
];

export default function HomePage() {
  const searchParams = useSearchParams();
  const [language, setLanguage] = useState<Language>("zh");
  const [contentType, setContentType] = useState<ContentType>((searchParams.get("type") as ContentType) || "text");
  const [selectedDimensions, setSelectedDimensions] = useState<string[]>([]);
  const [selectedModels, setSelectedModels] = useState<Model[]>([]);
  const [uploadContent, setUploadContent] = useState("");
  const [uploadUrl, setUploadUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompts, setPrompts] = useState<Record<Model, string>>({
    deepseek: "",
    kimi: "",
    minimax: "",
  });
  const [credits, setCredits] = useState(520);

  useEffect(() => {
    const type = searchParams.get("type") as ContentType;
    if (type && ["text", "image", "video", "web"].includes(type)) {
      setContentType(type);
    }
  }, [searchParams]);

  const handleDimensionClick = (dim: string) => {
    setSelectedDimensions((prev) =>
      prev.includes(dim) ? prev.filter((d) => d !== dim) : [...prev, dim]
    );
  };

  const handleModelToggle = (model: Model) => {
    setSelectedModels((prev) =>
      prev.includes(model) ? prev.filter((m) => m !== model) : [...prev, model]
    );
  };

  const handleAnalyze = async () => {
    if (!uploadContent && !uploadUrl) return;
    if (selectedModels.length === 0) return;

    setIsAnalyzing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    const mockPrompts: Record<Model, string> = {
      deepseek: `基于上传的${contentType === 'text' ? '文字内容' : contentType === 'image' ? '图片' : contentType === 'video' ? '视频' : '网页'}，请分析以下维度：${selectedDimensions.join('、')}。请生成专业、可复用的AI提示词。`,
      kimi: `请对以下内容进行深度分析，重点关注：${selectedDimensions.join('、')}。生成高质量提示词，要求逻辑清晰、表达准确。`,
      minimax: `根据上传的${contentType === 'text' ? '文档' : '素材'}，提取关键信息，生成适用于${selectedDimensions.slice(0, 3).join('、')}等场景的AI提示词。`,
    };

    setPrompts(mockPrompts);
    setIsAnalyzing(false);
    setCredits((prev) => Math.max(0, prev - selectedModels.length * 10));
  };

  const contentTypes = [
    { key: "text", label: "文字文档", icon: FileText },
    { key: "image", label: "图片视觉", icon: ImageIcon },
    { key: "video", label: "视频解构", icon: Video },
    { key: "web", label: "网页设计", icon: Globe },
  ];

  const currentTags = TAG_OPTIONS[contentType];

  return (
    <div className="max-w-6xl mx-auto pb-8">
      {/* 内容分类切换 */}
      <div className="flex gap-2 mb-4">
        {contentTypes.map((type) => (
          <button
            key={type.key}
            onClick={() => setContentType(type.key as ContentType)}
            className={cn(
              "px-3 py-1.5 text-sm font-medium rounded-lg transition-all flex items-center gap-1.5",
              contentType === type.key
                ? "bg-slate-700 text-white"
                : "bg-white text-slate-500 border border-slate-200 hover:border-slate-300"
            )}
          >
            <type.icon className="w-3.5 h-3.5" />
            {type.label}
          </button>
        ))}
      </div>

      {/* 上传内容 + 分析维度 */}
      <div className="glass-card rounded-xl p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-slate-700">{language === "zh" ? "上传内容" : "Upload Content"}</h3>
          <span className="text-xs px-2 py-0.5 rounded bg-blue-50 text-blue-600 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            AI {language === "zh" ? "就绪" : "Ready"}
          </span>
        </div>

        {/* 上传区域 */}
        <div className="mb-4">
          <div className="upload-zone py-6 mb-3">
            <Upload className="w-6 h-6 mx-auto text-slate-400 mb-2" />
            <p className="text-sm text-slate-500">{language === "zh" ? "拖拽或点击上传" : "Drag or click to upload"}</p>
            <input type="file" className="hidden" id="file-upload" />
          </div>
          
          {/* URL 输入 */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder={language === "zh" ? "或输入网页链接..." : "Or enter URL..."}
              value={uploadUrl}
              onChange={(e) => setUploadUrl(e.target.value)}
              className="input-field flex-1 text-sm"
            />
          </div>
        </div>

        {/* 分析维度 */}
        <div>
          <h4 className="text-xs font-medium text-slate-500 mb-2">{language === "zh" ? "分析维度（可多选）" : "Analysis Dimensions (Multiple)"}</h4>
          <div className="flex flex-wrap gap-1.5">
            {currentTags.map((tag) => (
              <button
                key={tag}
                onClick={() => handleDimensionClick(tag)}
                className={cn(
                  "px-2 py-1.5 text-xs rounded transition-all truncate",
                  selectedDimensions.includes(tag)
                    ? "bg-blue-500 text-white"
                    : "bg-white text-slate-600 border border-slate-200 hover:border-blue-300"
                )}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 模型选择 + 开始分析 */}
      <div className="glass-card rounded-xl p-4 mb-4">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm font-medium text-slate-600">{language === "zh" ? "选择模型" : "Select Models"}:</span>
          
          <div className="flex gap-2">
            {MODELS.map((model) => (
              <button
                key={model.key}
                onClick={() => handleModelToggle(model.key)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm transition-all",
                  selectedModels.includes(model.key)
                    ? `${model.color} text-white border-transparent`
                    : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                )}
              >
                <Check className={cn("w-3 h-3", selectedModels.includes(model.key) ? "opacity-100" : "opacity-0")} />
                {model.name}
                <span className="text-xs opacity-70">{model.region}</span>
              </button>
            ))}
          </div>

          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !uploadContent && !uploadUrl || selectedModels.length === 0}
            className="btn-primary flex items-center gap-1.5 text-sm px-4 py-2 ml-auto"
          >
            {isAnalyzing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
            {language === "zh" ? "开始分析" : "Start Analysis"}
          </button>

          <div className="flex items-center gap-1 px-2 py-1 bg-amber-50 border border-amber-200 rounded">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span className="text-xs font-medium text-amber-600">{credits}</span>
          </div>
        </div>
      </div>

      {/* 三个模型生成的提示词卡片 */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {MODELS.map((model) => {
          const isSelected = selectedModels.includes(model.key);
          const prompt = prompts[model.key];
          
          return (
            <div
              key={model.key}
              className={cn(
                "glass-card rounded-xl p-3 transition-all",
                !isSelected && "opacity-40",
                !prompt && "min-h-[180px]"
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={cn("w-2 h-2 rounded-full", model.color)} />
                  <span className="text-sm font-medium text-slate-700">{model.name}</span>
                </div>
                {prompt && (
                  <div className="flex gap-1">
                    <button className="p-1 hover:bg-slate-100 rounded">
                      <Copy className="w-3 h-3 text-slate-400" />
                    </button>
                    <button className="p-1 hover:bg-slate-100 rounded">
                      <Star className="w-3 h-3 text-slate-400" />
                    </button>
                  </div>
                )}
              </div>
              
              {prompt ? (
                <div className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">
                  {prompt}
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-slate-400">
                  {isSelected ? (language === "zh" ? "等待生成..." : "Waiting...") : (language === "zh" ? "请先选择模型" : "Select model first")}
                </div>
              )}
              
              {/* 字符计数 */}
              {prompt && (
                <div className="text-xs text-slate-400 mt-2">
                  {prompt.length} {language === "zh" ? "字符" : "chars"}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 创意生成按钮 */}
      {prompts.deepseek || prompts.kimi || prompts.minimax ? (
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-3">
            <button disabled={isGenerating} className="btn-primary flex items-center gap-1.5 text-sm px-4 py-2">
              {isGenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
              {language === "zh" ? "创意生成" : "Creative Generate"}
            </button>
            
            <span className="text-xs text-slate-500">
              {language === "zh" ? "基于生成的提示词进行二次创作" : "Generate variations based on prompts"}
            </span>
          </div>
        </div>
      ) : null}
    </div>
  );
}
