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
  CreditCard,
  Zap,
  Play,
  Twitter,
  Facebook,
} from "lucide-react";
import { cn } from "@/lib/utils";

type ContentType = "text" | "image" | "video" | "web";
type Language = "zh" | "en";
type AIStatus = "ready" | "analyzing" | "generating" | "done";

// 动态分析维度
const DIMENSIONS: Record<ContentType, { key: string; zh: string; en: string }[]> = {
  text: [
    { key: "general", zh: "通用创作", en: "General" },
    { key: "chatgpt", zh: "ChatGPT长文本", en: "ChatGPT" },
    { key: "claude", zh: "Claude合规", en: "Claude" },
    { key: "summary", zh: "核心观点", en: "Summary" },
    { key: "logic", zh: "逻辑结构", en: "Logic" },
    { key: "video_script", zh: "口播脚本", en: "Video Script" },
    { key: "ppt", zh: "PPT大纲", en: "PPT Outline" },
    { key: "marketing", zh: "营销转化", en: "Marketing" },
    { key: "academic", zh: "学术润色", en: "Academic" },
    { key: "code", zh: "代码文档", en: "Code Doc" },
  ],
  image: [
    { key: "midjourney", zh: "Midjourney", en: "Midjourney" },
    { key: "dalle", zh: "DALL-E 3", en: "DALL-E 3" },
    { key: "sd", zh: "Stable Diffusion", en: "SD" },
    { key: "style", zh: "风格提取", en: "Style" },
    { key: "color", zh: "色彩搭配", en: "Color" },
    { key: "composition", zh: "构图光影", en: "Composition" },
    { key: "ecommerce", zh: "电商商品", en: "E-commerce" },
    { key: "poster", zh: "海报文案", en: "Poster" },
    { key: "illustration", zh: "插画创作", en: "Illustration" },
    { key: "photo", zh: "摄影参数", en: "Photo" },
  ],
  video: [
    { key: "pika", zh: "Pika视频", en: "Pika" },
    { key: "runway", zh: "Runway Gen-4", en: "Runway" },
    { key: "kling", zh: "可灵AI", en: "Kling" },
    { key: "shot", zh: "运镜转场", en: "Shot" },
    { key: "video_style", zh: "画面风格", en: "Style" },
    { key: "subtitle", zh: "字幕口播", en: "Subtitle" },
    { key: "story", zh: "剧情脚本", en: "Story" },
    { key: "storyboard", zh: "分镜设计", en: "Storyboard" },
    { key: "bgm", zh: "BGM匹配", en: "BGM" },
    { key: "edit", zh: "AI剪辑", en: "Editing" },
  ],
  web: [
    { key: "v0", zh: "V0建站", en: "V0" },
    { key: "framed", zh: "Framed网页", en: "Framed" },
    { key: "structure", zh: "结构组件", en: "Structure" },
    { key: "design", zh: "设计配色", en: "Design" },
    { key: "interaction", zh: "交互逻辑", en: "Interaction" },
    { key: "react", zh: "React组件", en: "React" },
    { key: "responsive", zh: "响应式", en: "Responsive" },
    { key: "seo", zh: "SEO优化", en: "SEO" },
    { key: "landing", zh: "Landing Page", en: "Landing" },
    { key: "library", zh: "组件库", en: "Library" },
  ],
};

// 模型列表
const MODELS_ZH = [
  { key: "doubao", name: "豆包", free: true },
  { key: "kimi", name: "Kimi", free: true },
  { key: "qwen", name: "Qwen", free: true },
  { key: "deepseek", name: "DeepSeek", free: true },
  { key: "tongyi", name: "通义千问", free: true },
  { key: "gemini", name: "Gemini Flash", free: true },
];

const MODELS_EN = [
  { key: "llama", name: "Llama 4", free: true },
  { key: "mistral", name: "Mistral", free: true },
  { key: "haiku", name: "Claude Haiku", free: true },
  { key: "gpt_mini", name: "GPT-4o mini", free: true },
  { key: "gemini", name: "Gemini Flash", free: true },
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
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string>("");
  const [credits, setCredits] = useState(520);
  const [selectedModel, setSelectedModel] = useState("");
  const [imageCount, setImageCount] = useState(1);
  const [copied, setCopied] = useState(false);
  const [showModelDropdown, setShowModelDropdown] = useState(false);

  const models = language === "zh" ? MODELS_ZH : MODELS_EN;
  const dimensions = DIMENSIONS[contentType];

  useEffect(() => {
    setContentType(typeParam as ContentType);
  }, [typeParam]);

  useEffect(() => {
    setSelectedModel(models[0]?.key || "");
  }, [language]);

  const handleContentTabClick = (key: string) => {
    setContentType(key as ContentType);
    setSelectedDimensions([]);
    setPrompt("");
    setGeneratedContent("");
    router.push(`/?type=${key}`);
  };

  const handleAnalyze = async () => {
    if (selectedDimensions.length === 0 || credits < 50) return;
    
    setIsAnalyzing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setPrompt(`# AI 生成的提示词\n\n选中维度：${selectedDimensions.map(k => dimensions.find(d => d.key === k)?.zh).join("、")}\n\n这是一段示例提示词内容...`);
    setCredits(prev => prev - 50);
    setIsAnalyzing(false);
  };

  const handleGenerate = async () => {
    if (credits < 100) return;
    
    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setGeneratedContent(language === "zh" 
      ? "这是 AI 生成的创意内容...\n\n基于您的提示词，AI 为您生成了以上方案。您可以直接复制使用，或继续调整提示词重新生成。"
      : "AI-generated creative content...\n\nBased on your prompt, AI generated the above solution.");
    
    setCredits(prev => prev - 100);
    setIsGenerating(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedContent || prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleDimension = (key: string) => {
    setSelectedDimensions(prev => 
      prev.includes(key) ? prev.filter(d => d !== key) : [...prev, key]
    );
  };

  // 社交媒体图标
  const socialIcons = language === "zh" 
    ? [
        { name: "微信", icon: "💬" },
        { name: "微博", icon: "📢" },
        { name: "小红书", icon: "📕" },
        { name: "抖音", icon: "🎵" },
      ]
    : [
        { name: "X", icon: <Twitter className="w-4 h-4" /> },
        { name: "Facebook", icon: <Facebook className="w-4 h-4" /> },
        { name: "Reddit", icon: "🔴" },
        { name: "Pinterest", icon: "📌" },
      ];

  return (
    <div className="max-w-4xl mx-auto pb-8">
      {/* 内容分类切换 - 与左侧联动 */}
      <div className="flex gap-2 mb-4">
        {CONTENT_TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => handleContentTabClick(tab.key)}
            className={cn(
              "px-3 py-1.5 text-sm font-medium rounded-lg transition-all",
              contentType === tab.key
                ? "bg-slate-700 text-white"
                : "bg-white text-slate-500 border border-slate-200 hover:border-slate-300"
            )}
          >
            {language === "zh" ? tab.zh : tab.en}
          </button>
        ))}
      </div>

      {/* 上传区域 */}
      <div className="glass-card rounded-xl p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-slate-700">
            {language === "zh" ? "上传内容" : "Upload"}
          </h3>
          <span className="text-xs px-2 py-0.5 rounded bg-blue-50 text-blue-600 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            {language === "zh" ? "AI 就绪" : "Ready"}
          </span>
        </div>
        
        {contentType === "web" ? (
          <div className="flex gap-2">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder={language === "zh" ? "粘贴网页 URL" : "Paste URL"}
              className="input-field flex-1 text-sm py-2"
            />
            <button className="btn-primary text-sm px-3 py-2">
              {language === "zh" ? "获取" : "Fetch"}
            </button>
          </div>
        ) : (
          <div className="upload-zone py-6">
            {uploadedFile ? (
              <div className="flex items-center justify-center gap-3">
                <FileText className="w-6 h-6 text-slate-400" />
                <span className="text-sm text-slate-700">{uploadedFile.name}</span>
                <button onClick={() => setUploadedFile(null)} className="text-xs text-slate-500 hover:text-red-500">✕</button>
              </div>
            ) : (
              <>
                <Upload className="w-6 h-6 mx-auto text-slate-400 mb-2" />
                <p className="text-sm text-slate-500">{language === "zh" ? "拖拽或点击上传" : "Drag or click"}</p>
              </>
            )}
            <input type="file" className="hidden" id="file-upload" />
          </div>
        )}
      </div>

      {/* 分析维度 - 两行排列 */}
      <div className="glass-card rounded-xl p-4 mb-4">
        <h3 className="text-sm font-semibold text-slate-700 mb-3">
          {language === "zh" ? "分析维度" : "Dimensions"}
        </h3>
        <div className="grid grid-cols-5 gap-1.5">
          {dimensions.map(dim => (
            <button
              key={dim.key}
              onClick={() => toggleDimension(dim.key)}
              className={cn(
                "px-2 py-1.5 text-xs rounded transition-all truncate",
                selectedDimensions.includes(dim.key)
                  ? "bg-blue-500 text-white"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-blue-300"
              )}
            >
              {language === "zh" ? dim.zh : dim.en}
            </button>
          ))}
        </div>
      </div>

      {/* 提示词编辑区 */}
      <div className="glass-card rounded-xl p-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-slate-700">
            {language === "zh" ? "提示词" : "Prompt"}
          </h3>
          <div className="flex gap-1.5">
            <button onClick={copyToClipboard} className="text-xs px-2 py-1 bg-slate-100 rounded hover:bg-slate-200 flex items-center gap-1">
              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            </button>
            <button className="text-xs px-2 py-1 bg-slate-100 rounded hover:bg-slate-200 flex items-center gap-1">
              <Star className="w-3 h-3" />
            </button>
          </div>
        </div>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="input-field min-h-[100px] resize-none text-sm"
          placeholder={language === "zh" ? "AI 将在此生成提示词，您也可以手动编辑..." : "AI will generate prompt here..."}
        />
        <div className="text-xs text-slate-400 mt-1">{prompt.length} {language === "zh" ? "字符" : "chars"}</div>
      </div>

      {/* 模型选择 + 开始分析 */}
      <div className="glass-card rounded-xl p-4 mb-4">
        <div className="flex items-center gap-3 flex-wrap">
          {/* 模型选择 */}
          <div className="relative">
            <button 
              onClick={() => setShowModelDropdown(!showModelDropdown)}
              className="btn-secondary flex items-center gap-1.5 text-sm px-3 py-2"
            >
              {models.find(m => m.key === selectedModel)?.name || "选择模型"}
              <span className="text-xs text-green-600">免费</span>
            </button>
            
            {showModelDropdown && (
              <div className="absolute top-full left-0 mt-1 w-40 bg-white border rounded-lg shadow-lg z-10 py-1">
                {models.map(model => (
                  <button
                    key={model.key}
                    onClick={() => { setSelectedModel(model.key); setShowModelDropdown(false); }}
                    className={cn(
                      "w-full text-left px-3 py-1.5 text-sm hover:bg-slate-50 flex items-center justify-between",
                      selectedModel === model.key && "bg-blue-50"
                    )}
                  >
                    {model.name}
                    {model.free && <span className="text-xs text-green-600">免费</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 图片张数 */}
          {contentType === "image" && (
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4].map(n => (
                <button
                  key={n}
                  onClick={() => setImageCount(n)}
                  className={cn(
                    "w-6 h-6 text-xs rounded font-medium",
                    imageCount === n ? "bg-blue-500 text-white" : "bg-slate-100 text-slate-600"
                  )}
                >
                  {n}
                </button>
              ))}
            </div>
          )}

          {/* 开始分析 */}
          <button
            onClick={handleAnalyze}
            disabled={selectedDimensions.length === 0 || isAnalyzing}
            className="btn-primary flex items-center gap-1.5 text-sm px-4 py-2"
          >
            {isAnalyzing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
            {language === "zh" ? "开始分析" : "Analyze"}
          </button>

          {/* 创意生成 */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt}
            className="btn-primary flex items-center gap-1.5 text-sm px-4 py-2 ml-auto"
          >
            {isGenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />}
            {language === "zh" ? "创意生成" : "Generate"}
          </button>

          {/* 积分 */}
          <div className="flex items-center gap-1 px-2 py-1 bg-amber-50 border border-amber-200 rounded">
            <Zap className="w-3 h-3 text-amber-500" />
            <span className="text-xs font-medium text-amber-600">{credits}</span>
          </div>
        </div>
      </div>

      {/* 生成内容框 - 常驻 */}
      <div className="glass-card rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-slate-700">
            {language === "zh" ? "生成内容" : "Generated Content"}
          </h3>
          <div className="flex items-center gap-2">
            {/* 社交分享 */}
            <div className="flex items-center gap-1">
              {socialIcons.map((s, i) => (
                <button key={i} className="w-7 h-7 bg-slate-100 rounded flex items-center justify-center hover:bg-slate-200 text-sm">
                  {typeof s.icon === 'string' ? s.icon : s.icon}
                </button>
              ))}
            </div>
            {/* 下载 */}
            <button className="btn-secondary flex items-center gap-1 text-xs px-2 py-1.5">
              <Download className="w-3 h-3" />
              {language === "zh" ? "下载" : "Download"}
            </button>
          </div>
        </div>
        
        <div className="min-h-[200px] bg-slate-50 rounded-lg p-4 border border-slate-200">
          {generatedContent ? (
            <pre className="whitespace-pre-wrap text-sm text-slate-700">{generatedContent}</pre>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400 text-sm">
              {language === "zh" ? "生成内容将显示在这里..." : "Generated content will appear here..."}
            </div>
          )}
        </div>

        {/* 二次创作按钮 */}
        {generatedContent && (
          <div className="flex gap-2 mt-3 pt-3 border-t border-slate-200">
            <button className="btn-secondary flex items-center gap-1 text-xs px-3 py-1.5">
              <RefreshCw className="w-3 h-3" />
              {language === "zh" ? "重新生成" : "Regenerate"}
            </button>
            <button className="btn-secondary flex items-center gap-1 text-xs px-3 py-1.5">
              <Wand2 className="w-3 h-3" />
              {language === "zh" ? "换风格" : "Change Style"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
