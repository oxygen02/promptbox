"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Upload,
  Link2,
  Sparkles,
  Copy,
  Download,
  Share2,
  ChevronDown,
  Check,
  AlertCircle,
  Loader2,
  Image as ImageIcon,
  FileText,
  Video,
  Globe,
  Star,
  Clock,
  Settings,
  User,
  Zap,
  BookOpen,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

type ContentType = "text" | "image" | "video" | "web";
type Language = "zh" | "en";

// 周度动态分析维度 - 每周自动更新
const DIMENSION_OPTIONS: Record<ContentType, string[]> = {
  text: [
    "写作风格优化", "结构化处理", "场景化适配", 
    "情感表达增强", "专业术语转化", "口语化润色",
    "标题生成", "摘要提炼", "续写扩展", "风格迁移"
  ],
  image: [
    "风格提取", "构图优化", "光线调整", "色彩增强",
    "场景重建", "元素添加", "意境渲染", "质感提升",
    "视角转换", "艺术化处理"
  ],
  video: [
    "脚本创作", "运镜分析", "节奏把控",
    "分镜设计", "配乐建议", "字幕设计",
    "转场优化", "情绪板生成", "故事板创作", "视觉特效"
  ],
  web: [
    "结构提取", "配色分析", "布局优化",
    "交互设计", "响应式适配", "动效建议",
    "可用性提升", "品牌视觉", "信息架构", "用户体验"
  ],
};

const MODELS = [
  { value: "deepseek", label: "DeepSeek", labelEn: "DeepSeek", free: true },
  { value: "kimi", label: "Kimi", labelEn: "Kimi", free: true },
  { value: "minimax", label: "MiniMax", labelEn: "MiniMax", free: true },
  { value: "gpt4o", label: "GPT-4o", labelEn: "GPT-4o", free: false },
  { value: "claude", label: "Claude", labelEn: "Claude", free: false },
];

const CONTENT_TABS = [
  { key: "text", label: "文字文档", labelEn: "Text" },
  { key: "image", label: "图片视觉", labelEn: "Image" },
  { key: "video", label: "视频解构", labelEn: "Video" },
  { key: "web", label: "网页设计", labelEn: "Web" },
] as const;

function HomeContent() {
  const searchParams = useSearchParams();
  const typeParam = searchParams.get("type");

  const [language, setLanguage] = useState<Language>("zh");
  const [contentType, setContentType] = useState<ContentType>((typeParam as ContentType) || "text");
  const [uploadMode, setUploadMode] = useState<"file" | "url">("file");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [urlInput, setUrlInput] = useState("");
  const [selectedDimensions, setSelectedDimensions] = useState<string[]>([]);
  const [prompt, setPrompt] = useState("");
  const [optimizationTip, setOptimizationTip] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const [imageCount, setImageCount] = useState(1);
  const [copied, setCopied] = useState(false);
  const [credits, setCredits] = useState(520);
  const [aiStatus, setAiStatus] = useState<"idle" | "ready" | "analyzing" | "generating">("idle");

  useEffect(() => {
    if (typeParam) {
      setContentType(typeParam as ContentType);
      setUploadMode(typeParam === "web" ? "url" : "file");
    }
  }, [typeParam]);

  const t = language === "zh" ? {
    uploadTitle: "上传内容",
    uploadPlaceholder: "拖拽文件到此处，或点击上传",
    pasteUrl: "粘贴网页URL",
    dimensions: "分析维度",
    selectDimensions: "点击选择维度，AI将据此分析",
    startAnalyze: "开始分析",
    credits: "积分",
    editPrompt: "编辑提示词",
    optimizationTip: "优化建议",
    generate: "创意生成",
    selectModel: "选择模型",
    imageCount: "生成张数",
    preview: "生成结果",
    download: "下载",
    share: "分享",
    copySuccess: "已复制",
    analyzing: "AI 正在分析内容...",
    generating: "AI 正在生成内容...",
    analyzingComplete: "分析完成",
    generatingComplete: "生成完成",
    noCredits: "积分不足",
    reAnalyze: "重新分析",
  } : {
    uploadTitle: "Upload Content",
    uploadPlaceholder: "Drag file here, or click to upload",
    pasteUrl: "Paste webpage URL",
    dimensions: "Analysis Dimensions",
    selectDimensions: "Click to select dimensions for analysis",
    startAnalyze: "Start Analyze",
    credits: "Credits",
    editPrompt: "Edit Prompt",
    optimizationTip: "Optimization Tips",
    generate: "Generate",
    selectModel: "Select Model",
    imageCount: "Image Count",
    preview: "Results",
    download: "Download",
    share: "Share",
    copySuccess: "Copied",
    analyzing: "AI is analyzing...",
    generating: "AI is generating...",
    analyzingComplete: "Analysis Complete",
    generatingComplete: "Generation Complete",
    noCredits: "Insufficient Credits",
    reAnalyze: "Re-analyze",
  };

  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
    setAiStatus("ready");
  };

  const handleAnalyze = async () => {
    if (selectedDimensions.length === 0 || credits < 50) return;
    
    setIsAnalyzing(true);
    setAiStatus("analyzing");
    
    // 模拟 AI 分析
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const samplePrompt = language === "zh" 
      ? `请根据以下内容生成优化提示词...\n\n选中维度：${selectedDimensions.join("、")}\n\n这是一段示例内容，用于演示提示词生成功能。`
      : `Generate an optimized prompt based on the following content...\n\nSelected dimensions: ${selectedDimensions.join(", ")}\n\nThis is sample content for demonstration.`;
    
    const sampleTip = language === "zh"
      ? "建议增加具体场景描述，使用更具画面感的词汇，避免过于抽象的表达。"
      : "Consider adding specific scene descriptions, use more vivid vocabulary, and avoid overly abstract expressions.";
    
    setPrompt(samplePrompt);
    setOptimizationTip(sampleTip);
    setCredits(prev => prev - 50);
    setIsAnalyzing(false);
    setAiStatus("ready");
  };

  const handleGenerate = async () => {
    if (credits < 100) return;
    
    setIsGenerating(true);
    setAiStatus("generating");
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setGeneratedContent({
      text: language === "zh" 
        ? "这是生成的创意内容...\n\n根据您提供的提示词，AI 为您生成了以下创意方案。"
        : "Here is the generated creative content...\n\nBased on your prompt, AI has generated the following creative solutions.",
      images: Array(imageCount).fill(null).map((_, i) => ({
        url: `https://picsum.photos/seed/${Date.now() + i}/800/600`,
        prompt: prompt,
      })),
    });
    
    setCredits(prev => prev - 100);
    setIsGenerating(false);
    setAiStatus("ready");
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleDimension = (dim: string) => {
    setSelectedDimensions(prev => 
      prev.includes(dim) 
        ? prev.filter(d => d !== dim)
        : [...prev, dim]
    );
  };

  return (
    <div className="min-h-screen pb-12">
      {/* 内容分类标签 */}
      <div className="mb-8">
        <div className="flex gap-2 flex-wrap">
          {CONTENT_TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => {
                setContentType(tab.key as ContentType);
                setUploadMode(tab.key === "web" ? "url" : "file");
                setUploadedFile(null);
                setUrlInput("");
                setPrompt("");
                setGeneratedContent(null);
              }}
              className={cn(
                "px-5 py-2.5 rounded-xl font-medium transition-all duration-200",
                contentType === tab.key
                  ? "bg-slate-700 text-white shadow-lg"
                  : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
              )}
            >
              {language === "zh" ? tab.label : tab.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* 上传区域 - 液态玻璃卡片 */}
      <div className="glass-card rounded-2xl p-8 mb-8 card-hover">
        <h2 className="text-xl font-semibold text-slate-800 mb-6">{t.uploadTitle}</h2>
        
        {uploadMode === "file" ? (
          <div className="upload-zone">
            {uploadedFile ? (
              <div className="flex flex-col items-center">
                <FileText className="w-16 h-16 text-slate-400 mb-4" />
                <p className="text-slate-700 font-medium">{uploadedFile.name}</p>
                <p className="text-slate-400 text-sm mt-1">
                  {(uploadedFile.size / 1024).toFixed(1)} KB
                </p>
                <button 
                  onClick={() => setUploadedFile(null)}
                  className="mt-4 text-sm text-slate-500 hover:text-slate-700"
                >
                  {language === "zh" ? "重新上传" : "Re-upload"}
                </button>
              </div>
            ) : (
              <>
                <Upload className="w-12 h-12 mx-auto text-slate-400 mb-4" />
                <p className="text-slate-600 mb-2">{t.uploadPlaceholder}</p>
                <p className="text-slate-400 text-sm">
                  {contentType === "text" && (language === "zh" ? "支持 .txt, .md, .pdf, .doc" : "Support .txt, .md, .pdf, .doc")}
                  {contentType === "image" && (language === "zh" ? "支持 .jpg, .png, .gif, .webp" : "Support .jpg, .png, .gif, .webp")}
                  {contentType === "video" && (language === "zh" ? "支持 .mp4, .mov, .avi" : "Support .mp4, .mov, .avi")}
                </p>
                <input
                  type="file"
                  className="hidden"
                  accept={
                    contentType === "text" ? ".txt,.md,.pdf,.doc,.docx" :
                    contentType === "image" ? "image/*" :
                    contentType === "video" ? "video/*" : "*"
                  }
                  onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                />
              </>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <Link2 className="w-5 h-5 text-slate-400" />
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder={t.pasteUrl}
                className="flex-1 bg-transparent outline-none text-slate-700 placeholder:text-slate-400"
              />
            </div>
            {urlInput && (
              <button
                onClick={() => setAiStatus("ready")}
                className="w-full py-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-colors"
              >
                {language === "zh" ? "获取网页内容" : "Fetch Content"}
              </button>
            )}
          </div>
        )}
      </div>

      {/* 分析维度选择 - 液态玻璃卡片 */}
      <div className="glass-card rounded-2xl p-8 mb-8 card-hover">
        <h2 className="text-xl font-semibold text-slate-800 mb-2">{t.dimensions}</h2>
        <p className="text-slate-500 text-sm mb-6">{t.selectDimensions}</p>
        
        <div className="flex flex-wrap gap-2">
          {DIMENSION_OPTIONS[contentType].map(dim => (
            <button
              key={dim}
              onClick={() => toggleDimension(dim)}
              className={cn(
                "tag-item",
                selectedDimensions.includes(dim) && "active"
              )}
            >
              {dim}
            </button>
          ))}
        </div>
      </div>

      {/* 分析按钮 */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={handleAnalyze}
          disabled={selectedDimensions.length === 0 || isAnalyzing || credits < 50}
          className={cn(
            "btn-primary flex items-center gap-2 text-lg px-8 py-3",
            (selectedDimensions.length === 0 || isAnalyzing || credits < 50) && 
              "opacity-50 cursor-not-allowed"
          )}
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              {t.analyzing}
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              {t.startAnalyze}
            </>
          )}
        </button>
        
        <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-100">
          <Zap className="w-4 h-4 text-amber-500" />
          <span className="font-semibold text-amber-700">{credits}</span>
          <span className="text-amber-600 text-sm">{t.credits}</span>
        </div>
      </div>

      {/* 提示词编辑区 */}
      {prompt && (
        <div className="glass-card rounded-2xl p-8 mb-8 card-hover animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-slate-800">{t.editPrompt}</h2>
            <div className="flex gap-2">
              <button
                onClick={copyToClipboard}
                className="btn-secondary flex items-center gap-1.5 text-sm"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? t.copySuccess : (language === "zh" ? "复制" : "Copy")}
              </button>
              <button className="btn-secondary flex items-center gap-1.5 text-sm">
                <Star className="w-4 h-4" />
                {language === "zh" ? "收藏" : "Save"}
              </button>
            </div>
          </div>
          
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="input-field min-h-[150px] resize-none"
            placeholder={language === "zh" ? "编辑你的提示词..." : "Edit your prompt..."}
          />
          
          {optimizationTip && (
            <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
              <div className="flex items-center gap-2 text-blue-700 font-medium mb-2">
                <AlertCircle className="w-4 h-4" />
                {t.optimizationTip}
              </div>
              <p className="text-blue-600 text-sm">{optimizationTip}</p>
            </div>
          )}
          
          {/* 生成选项 */}
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600">{t.selectModel}:</span>
              <select className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-700">
                {MODELS.map(model => (
                  <option key={model.value} value={model.value}>
                    {language === "zh" ? model.label : model.labelEn} {model.free ? "🆓" : ""}
                  </option>
                ))}
              </select>
            </div>
            
            {contentType === "image" && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600">{t.imageCount}:</span>
                <div className="flex gap-1">
                  {[1, 2, 4].map(num => (
                    <button
                      key={num}
                      onClick={() => setImageCount(num)}
                      className={cn(
                        "w-8 h-8 rounded-lg text-sm font-medium transition-colors",
                        imageCount === num 
                          ? "bg-slate-700 text-white" 
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      )}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <button
              onClick={handleGenerate}
              disabled={isGenerating || credits < 100}
              className={cn(
                "btn-primary flex items-center gap-2 ml-auto",
                (isGenerating || credits < 100) && "opacity-50 cursor-not-allowed"
              )}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {t.generating}
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  {t.generate} (-100 {t.credits})
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* 生成结果 */}
      {generatedContent && (
        <div className="glass-card rounded-2xl p-8 card-hover animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-800">{t.preview}</h2>
            <div className="flex gap-2">
              <button className="btn-secondary flex items-center gap-1.5 text-sm">
                <Download className="w-4 h-4" />
                {t.download}
              </button>
              <button className="btn-secondary flex items-center gap-1.5 text-sm">
                <Share2 className="w-4 h-4" />
                {t.share}
              </button>
            </div>
          </div>
          
          {generatedContent.text && (
            <div className="p-4 bg-slate-50 rounded-xl mb-4">
              <pre className="whitespace-pre-wrap text-slate-700 font-mono text-sm">
                {generatedContent.text}
              </pre>
            </div>
          )}
          
          {generatedContent.images && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {generatedContent.images.map((img: any, i: number) => (
                <div key={i} className="relative group overflow-hidden rounded-xl">
                  <img 
                    src={img.url} 
                    alt={`Generated ${i + 1}`}
                    className="w-full aspect-square object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
                      <Download className="w-5 h-5 text-white" />
                    </button>
                    <button className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
                      <Share2 className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
