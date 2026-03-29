"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Upload,
  Link2,
  Sparkles,
  Copy,
  Download,
  Share2,
  Check,
  AlertCircle,
  Loader2,
  Image as ImageIcon,
  FileText,
  Video,
  Globe,
  Star,
  RefreshCw,
  Wand2,
  ArrowRight,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Zap,
  User,
  Play,
  FilePlus,
} from "lucide-react";
import { cn } from "@/lib/utils";

type ContentType = "text" | "image" | "video" | "web";
type Language = "zh" | "en";
type AIStatus = "ready" | "analyzing" | "generating" | "done";

// 动态分析维度（每周更新）
const DIMENSIONS: Record<ContentType, { key: string; zh: string; en: string }[]> = {
  text: [
    { key: "general", zh: "生成通用创作提示词", en: "General Creative Prompt" },
    { key: "chatgpt", zh: "生成 ChatGPT 长文本提示词", en: "ChatGPT Long Text Prompt" },
    { key: "claude", zh: "生成 Claude 合规提示词", en: "Claude Compliant Prompt" },
    { key: "summary", zh: "提取核心观点总结提示词", en: "Summary Prompt" },
    { key: "logic", zh: "优化文案逻辑结构提示词", en: "Logic Structure Prompt" },
    { key: "video_script", zh: "生成短视频口播脚本提示词", en: "Video Script Prompt" },
    { key: "ppt", zh: "生成 PPT 大纲提示词", en: "PPT Outline Prompt" },
    { key: "marketing", zh: "生成营销转化文案提示词", en: "Marketing Copy Prompt" },
    { key: "academic", zh: "生成学术润色提示词", en: "Academic Polish Prompt" },
    { key: "code", zh: "生成代码注释与文档提示词", en: "Code Documentation Prompt" },
  ],
  image: [
    { key: "midjourney", zh: "生成 Midjourney 提示词", en: "Midjourney Prompt" },
    { key: "dalle", zh: "生成 DALL-E 3 提示词", en: "DALL-E 3 Prompt" },
    { key: "sd", zh: "生成 Stable Diffusion 提示词", en: "Stable Diffusion Prompt" },
    { key: "style", zh: "提取画面风格关键词", en: "Style Keywords" },
    { key: "color", zh: "提取色彩搭配方案", en: "Color Scheme" },
    { key: "composition", zh: "提取构图与光影逻辑", en: "Composition & Lighting" },
    { key: "ecommerce", zh: "生成电商商品图描述", en: "E-commerce Product Image" },
    { key: "poster", zh: "生成海报宣传文案", en: "Poster Copy" },
    { key: "illustration", zh: "生成插画创作提示词", en: "Illustration Prompt" },
    { key: "photo", zh: "生成专业摄影参数提示词", en: "Photography Prompt" },
  ],
  video: [
    { key: "pika", zh: "生成 Pika 视频提示词", en: "Pika Video Prompt" },
    { key: "runway", zh: "生成 Runway Gen-4 提示词", en: "Runway Gen-4 Prompt" },
    { key: "kling", zh: "生成可灵 AI 中文视频提示词", en: "Kling AI Video Prompt" },
    { key: "shot", zh: "提取运镜与转场逻辑", en: "Camera Movement & Transitions" },
    { key: "video_style", zh: "提取画面风格关键词", en: "Video Style Keywords" },
    { key: "subtitle", zh: "提取字幕与口播文案", en: "Subtitle & Voiceover" },
    { key: "story", zh: "生成短视频剧情脚本", en: "Short Video Story" },
    { key: "storyboard", zh: "生成分镜设计提示词", en: "Storyboard Prompt" },
    { key: "bgm", zh: "提取 BGM 风格匹配", en: "BGM Style Matching" },
    { key: "edit", zh: "生成 AI 剪辑参数提示词", en: "AI Editing Prompt" },
  ],
  web: [
    { key: "v0", zh: "生成 V0 前端建站提示词", en: "V0 Web Builder Prompt" },
    { key: "framed", zh: "生成 Framed 网页提示词", en: "Framed Web Prompt" },
    { key: "structure", zh: "提取网页结构与组件", en: "Structure & Components" },
    { key: "design", zh: "提取网页设计风格与配色", en: "Design Style & Colors" },
    { key: "interaction", zh: "提取交互逻辑提示词", en: "Interaction Logic" },
    { key: "react", zh: "生成 React 组件提示词", en: "React Component Prompt" },
    { key: "responsive", zh: "生成响应式适配提示词", en: "Responsive Design Prompt" },
    { key: "seo", zh: "提取 SEO 优化关键词", en: "SEO Keywords" },
    { key: "landing", zh: "生成 Landing Page 转化提示词", en: "Landing Page Prompt" },
    { key: "library", zh: "生成组件库复用提示词", en: "Component Library Prompt" },
  ],
};

// 模型列表（按区域）
const MODELS_ZH = [
  { key: "doubao", name: "豆包", free: true },
  { key: "kimi", name: "Kimi", free: true },
  { key: "qwen", name: "Qwen", free: true },
  { key: "deepseek", name: "DeepSeek", free: true },
  { key: "tongyi", name: "通义千问", free: true },
  { key: "gemini_flash", name: "Gemini Flash", free: true },
  { key: "gpt4o", name: "GPT-4o", free: false },
  { key: "claude", name: "Claude", free: false },
];

const MODELS_EN = [
  { key: "llama4", name: "Llama 4", free: true },
  { key: "mistral", name: "Mistral", free: true },
  { key: "haiku", name: "Claude 3.5 Haiku", free: true },
  { key: "gpt_mini", name: "GPT-4o mini", free: true },
  { key: "gemini_flash", name: "Gemini Flash", free: true },
  { key: "deepseek", name: "DeepSeek", free: true },
  { key: "gpt4o", name: "GPT-4o", free: false },
  { key: "claude", name: "Claude", free: false },
];

const CONTENT_TABS = [
  { key: "text", zh: "文字文档", en: "Text" },
  { key: "image", zh: "图片视觉", en: "Image" },
  { key: "video", zh: "视频解构", en: "Video" },
  { key: "web", zh: "网页设计", en: "Web" },
];

function HomeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const typeParam = searchParams.get("type") || "text";

  const [language, setLanguage] = useState<Language>("zh");
  const [contentType, setContentType] = useState<ContentType>(typeParam as ContentType);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [urlInput, setUrlInput] = useState("");
  const [selectedDimensions, setSelectedDimensions] = useState<string[]>([]);
  const [prompt, setPrompt] = useState("");
  const [optimizationTip, setOptimizationTip] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const [credits, setCredits] = useState(520);
  const [aiStatus, setAiStatus] = useState<AIStatus>("ready");
  const [selectedModel, setSelectedModel] = useState("");
  const [imageCount, setImageCount] = useState(1);
  const [dimensionsScroll, setDimensionsScroll] = useState(0);
  const [copied, setCopied] = useState(false);
  const [showModelDropdown, setShowModelDropdown] = useState(false);

  const models = language === "zh" ? MODELS_ZH : MODELS_EN;
  const dimensions = DIMENSIONS[contentType];

  useEffect(() => {
    if (typeParam) {
      setContentType(typeParam as ContentType);
    }
  }, [typeParam]);

  useEffect(() => {
    setSelectedModel(models[0]?.key || "");
  }, [language, models]);

  const t = language === "zh" ? {
    uploadTitle: "上传内容",
    uploadPlaceholder: "拖拽文件到此处，或点击上传",
    pasteUrl: "粘贴网页 URL",
    dimensions: "分析维度",
    selectHint: "点击选择维度（可多选）",
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
    copied: "已复制",
    analyzing: "AI 正在分析...",
    generating: "AI 正在生成...",
    reGenerate: "重新生成",
    changeStyle: "换风格",
    expand: "扩写",
    simplify: "简化",
    fetchContent: "获取内容",
    charCount: "字符",
  } : {
    uploadTitle: "Upload Content",
    uploadPlaceholder: "Drag file here, or click to upload",
    pasteUrl: "Paste URL",
    dimensions: "Dimensions",
    selectHint: "Click to select (multi-select)",
    startAnalyze: "Start Analyze",
    credits: "Credits",
    editPrompt: "Edit Prompt",
    optimizationTip: "Optimization Tips",
    generate: "Generate",
    selectModel: "Model",
    imageCount: "Images",
    preview: "Results",
    download: "Download",
    share: "Share",
    copied: "Copied",
    analyzing: "AI analyzing...",
    generating: "AI generating...",
    reGenerate: "Regenerate",
    changeStyle: "Change Style",
    expand: "Expand",
    simplify: "Simplify",
    fetchContent: "Fetch",
    charCount: "chars",
  };

  const aiStatusText = {
    ready: language === "zh" ? "AI 就绪" : "AI Ready",
    analyzing: language === "zh" ? "分析中" : "Analyzing",
    generating: language === "zh" ? "生成中" : "Generating",
    done: language === "zh" ? "已完成" : "Done",
  };

  const handleContentTabClick = (key: string) => {
    setContentType(key as ContentType);
    setSelectedDimensions([]);
    setPrompt("");
    setGeneratedContent(null);
    router.push(`/?type=${key}`);
  };

  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
    setAiStatus("ready");
  };

  const handleAnalyze = async () => {
    if (selectedDimensions.length === 0 || credits < 50) return;
    
    setIsAnalyzing(true);
    setAiStatus("analyzing");
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const dims = selectedDimensions.map(d => {
      const dim = dimensions.find(dim => dim.key === d);
      return language === "zh" ? dim?.zh : dim?.en;
    }).join("、 ");
    
    setPrompt(`请根据内容生成优化提示词。选中维度：${dims}\n\n[此处为上传内容的分析结果...]`);
    setOptimizationTip(language === "zh" 
      ? "建议增加具体场景描述，使用更具画面感的词汇。"
      : "Consider adding specific scene descriptions and vivid vocabulary.");
    
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
        ? "这是 AI 生成的创意内容...\n\n基于您提供的提示词，AI 为您生成了以上方案。"
        : "This is AI-generated creative content...\n\nBased on your prompt, AI generated the above solutions.",
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

  const toggleDimension = (key: string) => {
    setSelectedDimensions(prev => 
      prev.includes(key) 
        ? prev.filter(d => d !== key)
        : [...prev, key]
    );
  };

  const scrollDimensions = (direction: "left" | "right") => {
    const container = document.getElementById("dimensions-container");
    if (container) {
      const scrollAmount = 200;
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      });
    }
  };

  return (
    <div className="pb-12">
      {/* 1. 内容分类切换栏 */}
      <div className="flex gap-2 mb-6">
        {CONTENT_TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => handleContentTabClick(tab.key)}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200",
              contentType === tab.key
                ? "bg-blue-500 text-white shadow-sm"
                : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
            )}
          >
            {language === "zh" ? tab.zh : tab.en}
          </button>
        ))}
      </div>

      {/* 2. 上传区域 */}
      <div className="glass-card rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-slate-800">{t.uploadTitle}</h2>
          <span className="text-xs px-2 py-1 rounded bg-blue-50 text-blue-600 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            {aiStatusText[aiStatus]}
          </span>
        </div>
        
        {contentType === "web" ? (
          <div className="flex gap-2">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder={t.pasteUrl}
              className="input-field flex-1"
            />
            <button className="btn-primary px-4">
              {t.fetchContent}
            </button>
          </div>
        ) : (
          <div className="upload-zone">
            {uploadedFile ? (
              <div className="flex items-center justify-center gap-4">
                <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center">
                  {contentType === "text" && <FileText className="w-8 h-8 text-slate-400" />}
                  {contentType === "image" && <ImageIcon className="w-8 h-8 text-slate-400" />}
                  {contentType === "video" && <Video className="w-8 h-8 text-slate-400" />}
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-slate-700">{uploadedFile.name}</p>
                  <p className="text-xs text-slate-500">{(uploadedFile.size / 1024).toFixed(1)} KB</p>
                </div>
                <button 
                  onClick={() => setUploadedFile(null)}
                  className="text-xs text-slate-500 hover:text-slate-700 ml-4"
                >
                  ✕
                </button>
              </div>
            ) : (
              <>
                <Upload className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                <p className="text-sm text-slate-600">{t.uploadPlaceholder}</p>
              </>
            )}
            <input
              type="file"
              className="hidden"
              id="file-upload"
              accept={
                contentType === "text" ? ".txt,.md,.pdf,.docx" :
                contentType === "image" ? "image/*" :
                contentType === "video" ? "video/*" : "*"
              }
              onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
            />
          </div>
        )}
      </div>

      {/* 3. 动态分析维度选择区 */}
      <div className="glass-card rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-slate-800">{t.dimensions}</h2>
          <span className="text-xs text-slate-500">{t.selectHint}</span>
        </div>
        
        <div className="relative">
          <button 
            onClick={() => scrollDimensions("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white shadow rounded-full flex items-center justify-center hover:bg-slate-50"
          >
            <ChevronLeft className="w-4 h-4 text-slate-600" />
          </button>
          
          <div 
            id="dimensions-container"
            className="flex gap-2 overflow-x-auto px-8 py-1 scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {dimensions.map(dim => (
              <button
                key={dim.key}
                onClick={() => toggleDimension(dim.key)}
                className={cn(
                  "tag whitespace-nowrap flex-shrink-0",
                  selectedDimensions.includes(dim.key) && "active"
                )}
              >
                {language === "zh" ? dim.zh : dim.en}
              </button>
            ))}
          </div>
          
          <button 
            onClick={() => scrollDimensions("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white shadow rounded-full flex items-center justify-center hover:bg-slate-50"
          >
            <ChevronRight className="w-4 h-4 text-slate-600" />
          </button>
        </div>
      </div>

      {/* 4. 提示词编辑区（常驻） */}
      <div className="glass-card rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-slate-800">{t.editPrompt}</h2>
          <div className="flex gap-2">
            <button onClick={copyToClipboard} className="btn-secondary flex items-center gap-1 text-xs px-3 py-1.5">
              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copied ? t.copied : (language === "zh" ? "复制" : "Copy")}
            </button>
            <button className="btn-secondary flex items-center gap-1 text-xs px-3 py-1.5">
              <Star className="w-3 h-3" />
              {language === "zh" ? "收藏" : "Save"}
            </button>
          </div>
        </div>
        
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="input-field min-h-[140px] resize-none"
          placeholder={language === "zh" ? "提示词编辑区..." : "Edit prompt here..."}
        />
        
        <div className="flex items-center justify-between mt-2">
          {optimizationTip && (
            <p className="text-xs text-slate-500 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {t.optimizationTip}: {optimizationTip}
            </p>
          )}
          <span className="text-xs text-slate-400 ml-auto">
            {prompt.length} {t.charCount}
          </span>
        </div>
      </div>

      {/* 5. 开始分析按钮 + 积分展示 */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={handleAnalyze}
          disabled={selectedDimensions.length === 0 || isAnalyzing || credits < 50}
          className="btn-primary flex items-center gap-2 px-6 py-2.5"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {t.analyzing}
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              {t.startAnalyze}
            </>
          )}
        </button>
        
        {/* 积分展示 */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg">
          <CreditCard className="w-4 h-4 text-amber-500" />
          <span className="text-sm font-semibold text-amber-600">{credits}</span>
          <span className="text-xs text-amber-500">{t.credits}</span>
        </div>
      </div>

      {/* 6. 模型选择下拉区 */}
      <div className="glass-card rounded-xl p-6 mb-6">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative">
            <button 
              onClick={() => setShowModelDropdown(!showModelDropdown)}
              className="btn-secondary flex items-center gap-2 text-sm"
            >
              {t.selectModel}: {models.find(m => m.key === selectedModel)?.name}
              <ArrowDown className="w-3 h-3" />
            </button>
            
            {showModelDropdown && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-20 py-1">
                {models.map(model => (
                  <button
                    key={model.key}
                    onClick={() => {
                      setSelectedModel(model.key);
                      setShowModelDropdown(false);
                    }}
                    className={cn(
                      "w-full text-left px-3 py-2 text-sm hover:bg-slate-50 flex items-center justify-between",
                      selectedModel === model.key && "bg-blue-50 text-blue-600"
                    )}
                  >
                    {model.name}
                    {model.free && <span className="text-xs text-green-600">免费</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {contentType === "image" && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600">{t.imageCount}:</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4].map(num => (
                  <button
                    key={num}
                    onClick={() => setImageCount(num)}
                    className={cn(
                      "w-8 h-8 rounded-lg text-sm font-medium transition-colors",
                      imageCount === num 
                        ? "bg-blue-500 text-white" 
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
            disabled={isGenerating || credits < 100 || !prompt}
            className="btn-primary flex items-center gap-2 ml-auto text-sm"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {t.generating}
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                {t.generate} (-100 {t.credits})
              </>
            )}
          </button>
        </div>
      </div>

      {/* 8. 生成结果展示区 */}
      {generatedContent && (
        <div className="glass-card rounded-xl p-6 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-slate-800">{t.preview}</h2>
            <div className="flex gap-2">
              <button className="btn-secondary flex items-center gap-1 text-xs px-3 py-1.5">
                <Download className="w-3 h-3" />
                {t.download}
              </button>
              <button className="btn-secondary flex items-center gap-1 text-xs px-3 py-1.5">
                <Share2 className="w-3 h-3" />
                {t.share}
              </button>
            </div>
          </div>
          
          {generatedContent.text && (
            <div className="p-4 bg-slate-50 rounded-lg mb-4">
              <pre className="whitespace-pre-wrap text-sm text-slate-700">
                {generatedContent.text}
              </pre>
            </div>
          )}
          
          {generatedContent.images && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {generatedContent.images.map((img: any, i: number) => (
                <div key={i} className="relative group overflow-hidden rounded-lg">
                  <img 
                    src={img.url} 
                    alt={`Generated ${i + 1}`}
                    className="w-full aspect-square object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                    <button className="p-2 bg-white/90 rounded-lg hover:bg-white">
                      <Download className="w-4 h-4 text-slate-700" />
                    </button>
                    <button className="p-2 bg-white/90 rounded-lg hover:bg-white">
                      <Share2 className="w-4 h-4 text-slate-700" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* 9. 二次创作按钮区 */}
          <div className="flex items-center gap-3 mt-6 pt-4 border-t border-slate-200">
            <button className="btn-secondary flex items-center gap-1.5 text-xs px-3 py-1.5">
              <RefreshCw className="w-3 h-3" />
              {t.reGenerate}
            </button>
            <button className="btn-secondary flex items-center gap-1.5 text-xs px-3 py-1.5">
              <Wand2 className="w-3 h-3" />
              {t.changeStyle}
            </button>
            <button className="btn-secondary flex items-center gap-1.5 text-xs px-3 py-1.5">
              <FilePlus className="w-3 h-3" />
              {t.expand}
            </button>
            <button className="btn-secondary flex items-center gap-1.5 text-xs px-3 py-1.5">
              <ArrowRight className="w-3 h-3" />
              {t.simplify}
            </button>
            
            <div className="flex items-center gap-1.5 ml-auto px-2 py-1 bg-amber-50 rounded">
              <Zap className="w-3 h-3 text-amber-500" />
              <span className="text-xs font-medium text-amber-600">{credits} {t.credits}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
