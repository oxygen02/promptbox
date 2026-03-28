"use client";

import { useState, useCallback, useEffect, Suspense } from "react";
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
  X,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ContentType = "text" | "image" | "video" | "web";
type Language = "zh" | "en";

const TAG_OPTIONS: Record<ContentType, string[]> = {
  text: ["正式", "轻松", "学术", "口语", "诗意", "专业", "幽默", "严肃", "温暖", "犀利"],
  image: ["写实", "抽象", "卡通", "极简", "赛博朋克", "复古", "清新", "浓郁", "梦幻", "硬朗"],
  video: ["快节奏", "慢节奏", "热血", "温馨", "神秘", "酷炫", "浪漫", "史诗", "纪实", "创意"],
  web: ["简约", "卡片式", "暗黑", "大气", "扁平", "拟物", "渐变", "单色", "玻璃拟态", "孟菲斯"],
};

const MODELS = [
  { value: "deepseek", label: "DeepSeek 🆓", labelEn: "DeepSeek 🆓" },
  { value: "kimi", label: "Kimi 🆓", labelEn: "Kimi 🆓" },
  { value: "minimax", label: "MiniMax 🆓", labelEn: "MiniMax 🆓" },
];

function HomeContent() {
  const searchParams = useSearchParams();
  const typeParam = searchParams.get("type");

  const [language, setLanguage] = useState<Language>("zh");
  const [contentType, setContentType] = useState<ContentType>((typeParam as ContentType) || "text");
  const [uploadMode, setUploadMode] = useState<"file" | "url">("file");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [urlInput, setUrlInput] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [analyzeModel, setAnalyzeModel] = useState("deepseek");
  const [generateModel, setGenerateModel] = useState("minimax");
  const [prompt, setPrompt] = useState("");
  const [optimizationTip, setOptimizationTip] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [imageCount, setImageCount] = useState(1);
  const [copied, setCopied] = useState(false);
  const [aiStatus, setAiStatus] = useState<"idle" | "recognizing" | "ready" | "analyzing" | "generating">("idle");

  useEffect(() => {
    if (typeParam) {
      setContentType(typeParam as ContentType);
      setUploadMode(typeParam === "web" ? "url" : "file");
    }
  }, [typeParam]);

  const tt = {
    zh: {
      uploadPlaceholder: "拖拽文件到此处，或点击上传",
      pasteUrl: "粘贴网页URL",
      analyze: "开始分析",
      editPrompt: "编辑提示词",
      generate: "创意生成",
      reGenerate: "二次创作",
      optimizationTip: "优化建议",
      selectModel: "选择模型",
      selectTags: "点击选择标签，帮助AI生成更精准的提示词",
      preview: "生成预览",
      download: "下载",
      share: "分享",
      copySuccess: "已复制",
      imageCount: "生成张数",
      uploadFile: "上传文件",
      inputUrl: "输入网址",
      uploading: "正在识别内容类型...",
      recognized: "已识别",
      analyzing: "正在分析生成提示词...",
      generating: "正在生成内容...",
      text: "文字",
      image: "图片",
      video: "视频",
      web: "网页",
    },
    en: {
      uploadPlaceholder: "Drag file here, or click to upload",
      pasteUrl: "Paste webpage URL",
      analyze: "Analyze",
      editPrompt: "Edit Prompt",
      generate: "Generate",
      reGenerate: "Create Again",
      optimizationTip: "Optimization Tip",
      selectModel: "Select Model",
      selectTags: "Select tags to help AI generate better prompts",
      preview: "Preview",
      download: "Download",
      share: "Share",
      copySuccess: "Copied",
      imageCount: "Image Count",
      uploadFile: "Upload File",
      inputUrl: "Input URL",
      uploading: "Recognizing content type...",
      recognized: "Recognized as",
      analyzing: "Analyzing and generating prompt...",
      generating: "Generating content...",
      text: "Text",
      image: "Image",
      video: "Video",
      web: "Web",
    },
  }[language];

  const handleFileUpload = useCallback((file: File) => {
    setUploadedFile(file);
    setAiStatus("recognizing");

    setTimeout(() => {
      if (file.type.startsWith("image/")) {
        setContentType("image");
      } else if (file.type.startsWith("video/")) {
        setContentType("video");
      } else {
        setContentType("text");
      }
      setAiStatus("ready");
    }, 1500);
  }, []);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleAnalyze = () => {
    if (selectedTags.length === 0) return;

    setIsAnalyzing(true);
    setAiStatus("analyzing");

    setTimeout(() => {
      const tags = selectedTags.join("、");
      setPrompt(
        language === "zh"
          ? `创建一个${tags}风格的原创内容，包含丰富细节和情感表达`
          : `Create original content with ${tags} style, rich in details and emotion`
      );
      setOptimizationTip(
        language === "zh"
          ? "建议添加具体场景描述，让内容更加丰富立体"
          : "Add specific scene description to make content richer"
      );
      setIsAnalyzing(false);
      setAiStatus("ready");
    }, 2000);
  };

  const handleGenerate = () => {
    if (!prompt) return;

    setIsGenerating(true);
    setAiStatus("generating");

    setTimeout(() => {
      setGeneratedContent(
        contentType === "image"
          ? "placeholder"
          : language === "zh"
          ? "这是AI生成的创意内容预览。根据您的提示词，系统已经生成了独特的内容。您可以继续编辑提示词进行二次创作，或者直接下载分享。"
          : "This is AI generated content preview. Based on your prompt, the system has generated unique content."
      );
      setIsGenerating(false);
      setAiStatus("ready");
    }, 3000);
  };

  const handleReGenerate = () => {
    setIsGenerating(true);
    setAiStatus("generating");

    setTimeout(() => {
      setGeneratedContent(
        language === "zh"
          ? "【二次创作】这是根据您编辑后的提示词重新生成的内容..."
          : "[Re-generated] This is content created from your edited prompt..."
      );
      setIsGenerating(false);
      setAiStatus("ready");
    }, 2000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getContentTypeLabel = () => {
    switch (contentType) {
      case "image": return language === "zh" ? "图片" : "Image";
      case "video": return language === "zh" ? "视频" : "Video";
      case "web": return language === "zh" ? "网页" : "Web";
      default: return language === "zh" ? "文字" : "Text";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-6 px-4 md:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* AI Status */}
        {aiStatus !== "idle" && (
          <div className="bg-white border border-slate-200 rounded-xl py-3 px-4 shadow-sm">
            <div className="flex items-center gap-2 text-base text-slate-700">
              {isAnalyzing || isGenerating ? (
                <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
              ) : (
                <Check className="w-5 h-5 text-green-500" />
              )}
              <span>
                {aiStatus === "recognizing" && (language === "zh" ? "🤖 正在识别内容类型..." : "🤖 Recognizing content type...")}
                {aiStatus === "ready" && (language === "zh" ? `✅ 已识别为「${getContentTypeLabel()}内容」` : `✅ Recognized as "${getContentTypeLabel()}" content`)}
                {aiStatus === "analyzing" && (language === "zh" ? "⚡ 正在分析生成提示词..." : "⚡ Analyzing prompt...")}
                {aiStatus === "generating" && (language === "zh" ? "🎨 正在生成内容..." : "🎨 Generating content...")}
              </span>
            </div>
          </div>
        )}

        {/* Upload Area */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="text-lg font-semibold text-slate-800 mb-4">
            {language === "zh" ? "上传内容" : "Upload Content"}
          </div>

          {/* Mode Toggle */}
          <div className="flex rounded-lg bg-slate-100 p-1 mb-4">
            <button
              onClick={() => setUploadMode("file")}
              className={cn(
                "flex-1 py-2.5 px-4 text-sm font-medium rounded-md transition-colors",
                uploadMode === "file" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
              )}
            >
              <Upload className="w-4 h-4 inline mr-2" />
              {tt.uploadFile}
            </button>
            <button
              onClick={() => setUploadMode("url")}
              className={cn(
                "flex-1 py-2.5 px-4 text-sm font-medium rounded-md transition-colors",
                uploadMode === "url" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
              )}
            >
              <Globe className="w-4 h-4 inline mr-2" />
              {tt.inputUrl}
            </button>
          </div>

          {uploadMode === "file" ? (
            !uploadedFile ? (
              <label className="block border-2 border-dashed border-slate-300 rounded-xl p-10 text-center hover:border-slate-400 transition-colors cursor-pointer bg-slate-50">
                <Upload className="w-10 h-10 mx-auto text-slate-400 mb-3" />
                <p className="text-slate-600">{tt.uploadPlaceholder}</p>
                <p className="text-slate-400 text-sm mt-1">
                  {language === "zh" ? "支持图片、视频、文档格式" : "Supports images, videos, documents"}
                </p>
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                  accept="image/*,video/*,.txt,.md,.pdf,.doc,.docx"
                />
              </label>
            ) : (
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-slate-500" />
                  <span className="text-sm text-slate-700">{uploadedFile.name}</span>
                </div>
                <button
                  onClick={() => {
                    setUploadedFile(null);
                    setAiStatus("idle");
                  }}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )
          ) : (
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="url"
                  placeholder={tt.pasteUrl}
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <Button onClick={() => urlInput && setAiStatus("ready")} variant="outline">
                {language === "zh" ? "确认" : "Confirm"}
              </Button>
            </div>
          )}
        </div>

        {/* Tag Selection */}
        {aiStatus === "ready" && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm animate-in slide-in-from-top-2 duration-300">
            <div className="text-base font-semibold text-slate-800 mb-2">{tt.selectTags}</div>
            <div className="flex flex-wrap gap-2 mt-3">
              {TAG_OPTIONS[contentType].map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-sm transition-all",
                    selectedTags.includes(tag) ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  )}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Model Selection & Analyze */}
        {selectedTags.length > 0 && (
          <div className="flex items-center gap-4 animate-in slide-in-from-top-2 duration-300">
            <div className="flex-1">
              <label className="text-xs text-slate-500 mb-1 block">{tt.selectModel}</label>
              <div className="relative">
                <select
                  value={analyzeModel}
                  onChange={(e) => setAnalyzeModel(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                >
                  {MODELS.map((model) => (
                    <option key={model.value} value={model.value}>
                      {language === "zh" ? model.label : model.labelEn}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>
            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing || selectedTags.length === 0}
              className="bg-slate-800 hover:bg-slate-700 px-6 py-2.5 text-sm mt-4"
            >
              {isAnalyzing ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4 mr-2" />
              )}
              {tt.analyze}
            </Button>
          </div>
        )}

        {/* Analysis Result */}
        {prompt && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm animate-in slide-in-from-top-2 duration-300">
            <div className="flex items-center justify-between mb-3">
              <label className="text-base font-semibold text-slate-800">
                {language === "zh" ? "分析结果" : "Analysis Result"}
              </label>
              <Button variant="ghost" size="sm" onClick={handleCopy}>
                {copied ? <Check className="w-4 h-4 text-green-500 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
                {copied ? tt.copySuccess : "Copy"}
              </Button>
            </div>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full h-28 p-4 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none bg-slate-50"
              placeholder={language === "zh" ? "输入提示词..." : "Enter prompt..."}
            />
            {optimizationTip && (
              <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5" />
                  <div>
                    <div className="text-xs font-medium text-amber-700">{tt.optimizationTip}</div>
                    <div className="text-xs text-amber-600 mt-0.5">{optimizationTip}</div>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-3 flex justify-end">
              <Button onClick={handleReGenerate} disabled={isGenerating} className="bg-slate-800 hover:bg-slate-700 px-5 py-2 text-sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                {tt.reGenerate}
              </Button>
            </div>
          </div>
        )}

        {/* Generate Section */}
        {prompt && (
          <div className="flex items-center gap-4 animate-in slide-in-from-top-2 duration-300">
            <div className="flex-1">
              <label className="text-xs text-slate-500 mb-1 block">{tt.selectModel}</label>
              <div className="relative">
                <select
                  value={generateModel}
                  onChange={(e) => setGenerateModel(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                >
                  {MODELS.map((model) => (
                    <option key={model.value} value={model.value}>
                      {language === "zh" ? model.label : model.labelEn}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt}
              className="bg-slate-800 hover:bg-slate-700 px-6 py-2.5 text-sm mt-4"
            >
              {isGenerating ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4 mr-2" />
              )}
              {tt.generate}
            </Button>
          </div>
        )}

        {/* Image Count */}
        {contentType === "image" && prompt && (
          <div className="flex items-center gap-4 animate-in slide-in-from-top-2 duration-300">
            <label className="text-sm text-slate-700">{tt.imageCount}:</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((count) => (
                <button
                  key={count}
                  onClick={() => setImageCount(count)}
                  className={cn(
                    "w-9 h-9 rounded-lg text-sm font-medium transition-all",
                    imageCount === count ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  )}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Generated Content Preview */}
        {generatedContent && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm animate-in slide-in-from-top-2 duration-300">
            <div className="flex items-center justify-between mb-4">
              <label className="text-base font-semibold text-slate-800">{tt.preview}</label>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-1" />
                  {tt.download}
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="w-4 h-4 mr-1" />
                  {tt.share}
                </Button>
              </div>
            </div>

            {contentType === "image" ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Array.from({ length: imageCount }).map((_, i) => (
                  <div key={i} className="aspect-square bg-slate-100 rounded-xl flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-slate-300" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-slate-50 rounded-xl min-h-[120px]">
                <p className="text-slate-700 text-sm leading-relaxed">{generatedContent}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">加载中...</div>}>
      <HomeContent />
    </Suspense>
  );
}
