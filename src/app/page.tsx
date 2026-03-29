"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
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
type Model = "deepseek" | "kimi" | "minimax" | "gpt4o" | "claude" | "gemini" | "qwen" | "zhipu" | "yi" | "spark";

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
  { key: "gpt4o", name: "GPT-4o", region: "Global" },
  { key: "claude", name: "Claude 3.5", region: "Global" },
  { key: "gemini", name: "Gemini Pro", region: "Global" },
  { key: "qwen", name: "通义千问", region: "CN" },
  { key: "zhipu", name: "智谱清言", region: "CN" },
  { key: "yi", name: "Yi", region: "CN" },
  { key: "spark", name: "讯飞星火", region: "CN" },
];

export default function HomePage() {
  const [contentType, setContentType] = useState<ContentType>("text");
  const [selectedDimensions, setSelectedDimensions] = useState<string[]>([]);
  const [uploadUrl, setUploadUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [credits] = useState(520);
  const [cardModels, setCardModels] = useState<Record<number, Model | null>>({ 0: null, 1: null, 2: null });
  const [cardPrompts, setCardPrompts] = useState<Record<number, string>>({ 0: "", 1: "", 2: "" });
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [openGenDropdown, setOpenGenDropdown] = useState(false);
  const [selectedGenModel, setSelectedGenModel] = useState<Model | null>(null);
  const [showShare, setShowShare] = useState(false);
  const [shareContent, setShareContent] = useState("");
  const [copied, setCopied] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

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
    setSelectedDimensions((prev) => prev.includes(dim) ? prev.filter((d) => d !== dim) : [...prev, dim]);
  };

  // 同步内容类型到 URL
  const handleContentTypeChange = (type: ContentType) => {
    setContentType(type);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("type", type);
      window.history.pushState({}, "", url);
    }
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

  const contentTypes = [{ key: "text", label: "文字文档" }, { key: "image", label: "图片视觉" }, { key: "video", label: "视频解构" }, { key: "web", label: "网页设计" }];
  const uploadTypes = [{ key: "text", label: "文字", icon: FileText }, { key: "doc", label: "文档", icon: File }, { key: "image", label: "图片", icon: Image }, { key: "video", label: "视频", icon: Video }];
  const currentTags = TAG_OPTIONS[contentType].slice(0, 12);
  const selectedCount = Object.values(cardModels).filter(Boolean).length;

  return (
    <div className="max-w-4xl mx-auto pb-8 relative pt-2">
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
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
            <h3 className="text-sm font-semibold text-slate-700">上传内容</h3>
            <span className="text-xs px-3 py-1 rounded-full bg-slate-100 text-slate-500 flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5" />AI 就绪</span>
          </div>
          <div className="flex justify-center gap-6 mb-4">
            {uploadTypes.map((type) => (<button key={type.key} className="flex flex-col items-center gap-1.5 p-3 rounded-xl hover:bg-slate-50 transition-colors"><type.icon className="w-5 h-5 text-slate-400" /><span className="text-xs text-slate-500">{type.label}</span></button>))}
          </div>
          <div className="flex gap-3 mb-4">
            <div className="flex-1"><label className="block upload-zone py-5 flex flex-col items-center justify-center min-h-[100px] cursor-pointer"><Upload className="w-5 h-5 text-slate-400 mb-2" /><p className="text-sm text-slate-500">拖拽或点击上传</p><input type="file" className="hidden" /></label></div>
            <div className="flex-1"><input type="text" placeholder="请输入网页链接 URL" value={uploadUrl} onChange={(e) => setUploadUrl(e.target.value)} className="input-field w-full py-3" /></div>
          </div>
          <div><h4 className="text-xs font-medium text-slate-500 mb-2">提示词维度（可多选）</h4><div className="grid grid-cols-6 gap-1.5">{currentTags.map((tag) => (<button key={tag} onClick={() => handleDimensionClick(tag)} className={cn("px-2 py-1.5 text-xs rounded-lg transition-all text-center", selectedDimensions.includes(tag) ? "bg-slate-800 text-white shadow" : "bg-slate-100 text-slate-600 hover:bg-slate-200")}>{tag}</button>))}</div></div>
        </div>
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[0, 1, 2].map((index) => { const model = cardModels[index]; const prompt = cardPrompts[index]; const modelInfo = MODELS.find((m) => m.key === model); return (
            <div key={index} className="glass-card rounded-xl p-4 relative">
              <div className="relative" ref={dropdownRef}>
                <button onClick={() => setOpenDropdown(openDropdown === index ? null : index)} className="w-full flex items-center justify-between px-3 py-2 text-sm bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"><span className={model ? "text-slate-700 font-medium" : "text-slate-400"}>{model ? modelInfo?.name : "选择模型"}</span><ChevronDown className="w-4 h-4 text-slate-400" /></button>
                {openDropdown === index && (<div className="dropdown-menu" style={{ left: 0, right: 0 }}><div className={cn("dropdown-item", !model && "active")} onClick={() => handleCardModelSelect(index, null)}>— 未选中 —</div>{MODELS.map((m) => (<div key={m.key} className={cn("dropdown-item", model === m.key && "active")} onClick={() => handleCardModelSelect(index, m.key)}>{m.name} ({m.region})</div>))}</div>)}
              </div>
              <div className="mt-3 min-h-[70px] text-sm text-slate-600 whitespace-pre-wrap">{prompt || "等待生成..."}</div>
              {prompt && (<div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-slate-100"><button onClick={() => handleShare(prompt)} className="p-1.5 hover:bg-slate-100 rounded-lg"><Share2 className="w-4 h-4 text-slate-400" /></button><button className="p-1.5 hover:bg-slate-100 rounded-lg"><Copy className="w-4 h-4 text-slate-400" /></button><button className="p-1.5 hover:bg-slate-100 rounded-lg"><Star className="w-4 h-4 text-slate-400" /></button></div>)}
            </div>
          );})}
        </div>
        <div className="flex items-center gap-4 mb-4">
          <button onClick={handleAnalyze} disabled={isAnalyzing || selectedCount === 0} className={cn("text-sm px-6 py-2 rounded-xl font-semibold transition-all shadow-lg bg-slate-800 text-white hover:bg-slate-900", selectedCount === 0 && "opacity-50 cursor-not-allowed")}>{isAnalyzing ? "分析中..." : "开始分析"}</button>
          <div className="flex items-center gap-2 text-sm"><span className="text-amber-500 font-medium">Credit</span><span className="text-slate-700 font-semibold">{credits}</span></div>
        </div>
        <div className="glass-card rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between mb-3"><h3 className="text-sm font-semibold text-slate-700">提示词编辑</h3><div className="flex gap-1.5"><button className="p-2 bg-slate-50 hover:bg-slate-100 rounded-lg"><Copy className="w-4 h-4 text-slate-400" /></button><button className="p-2 bg-slate-50 hover:bg-slate-100 rounded-lg"><Star className="w-4 h-4 text-slate-400" /></button></div></div>
          <textarea className="input-field min-h-[80px] resize-none" placeholder="编辑提示词..." />
          <div className="text-xs text-slate-400 mt-2">0 字符</div>
        </div>
        <div className="flex items-center gap-4 mb-4">
          <button onClick={handleCreativeGenerate} disabled={!selectedGenModel || isGenerating} className={cn("text-sm px-6 py-2 rounded-xl font-semibold transition-all shadow-lg bg-slate-800 text-white hover:bg-slate-900", !selectedGenModel && "opacity-50 cursor-not-allowed")}>{isGenerating ? "生成中..." : "创意生成"}</button>
          <div className="relative" ref={dropdownRef}>
            <button onClick={() => setOpenGenDropdown(!openGenDropdown)} className="flex items-center gap-2 px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl hover:bg-slate-50 font-medium text-slate-700">{selectedGenModel ? <>{MODELS.find(m => m.key === selectedGenModel)?.name}</> : <span className="text-slate-400">选择模型</span>}<ChevronDown className="w-4 h-4 text-slate-400" /></button>
            {openGenDropdown && (<div className="dropdown-menu" style={{ left: 0, minWidth: '140px' }}>{MODELS.map((m) => (<div key={m.key} className={cn("dropdown-item", selectedGenModel === m.key && "active")} onClick={() => { setSelectedGenModel(m.key); setOpenGenDropdown(false); }}>{m.name}</div>))}</div>)}
          </div>
          <div className="flex items-center gap-2 text-sm"><span className="text-amber-500 font-medium">Credit</span><span className="text-slate-700 font-semibold">{credits}</span></div>
        </div>
        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center justify-between mb-4"><h3 className="text-sm font-semibold text-slate-700">生成内容</h3></div>
          <div className="min-h-[140px] bg-slate-50 rounded-xl p-4 text-sm text-slate-700 whitespace-pre-wrap mb-4">{generatedContent || "点击上方「创意生成」按钮生成内容..."}</div>
          <div className="flex items-center justify-end gap-3"><div className="flex gap-2">
              <button className="w-9 h-9 rounded-full bg-slate-700 hover:bg-slate-800 flex items-center justify-center text-white"><svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348z"/></svg></button>
              <button className="w-9 h-9 rounded-full bg-slate-700 hover:bg-slate-800 flex items-center justify-center text-white"><svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.05-.2-.06-.06-.16-.04-.23-.02-.1.02-1.59 1.01-4.49 2.98-.42.29-.8.43-1.14.42-.38-.01-1.1-.22-1.64-.4-.66-.23-1.19-.35-1.14-.74.02-.2.29-.41.79-.63 3.12-1.36 5.2-2.26 6.24-2.7 2.97-1.24 3.59-1.45 3.99-1.46.09 0 .28.02.41.12.11.08.14.19.16.27-.01.06.01.24 0 .38z"/></svg></button>
              <button className="w-9 h-9 rounded-full bg-slate-700 hover:bg-slate-800 flex items-center justify-center text-white"><svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/></svg></button>
            </div><div className="flex gap-1.5 border-l border-slate-200 pl-3"><button onClick={() => handleShare(generatedContent)} disabled={!generatedContent} className="p-2 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"><Share2 className="w-4 h-4 text-slate-500" /></button><button onClick={handleCopy} disabled={!generatedContent} className="p-2 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50">{copied ? <CheckCircle className="w-4 h-4 text-slate-500" /> : <Copy className="w-4 h-4 text-slate-500" />}</button><button onClick={handleDownload} disabled={!generatedContent} className="p-2 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"><Download className="w-4 h-4 text-slate-500" /></button></div></div>
        </div>
        {showShare && (<div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" onClick={() => setShowShare(false)}><div className="glass-card rounded-2xl p-6 w-80" onClick={(e) => e.stopPropagation()}><div className="flex items-center justify-between mb-5"><h3 className="text-base font-semibold text-slate-700">分享</h3><button onClick={() => setShowShare(false)} className="p-1.5 hover:bg-slate-100 rounded-lg"><X className="w-5 h-5 text-slate-400" /></button></div><div className="flex justify-center gap-4 mb-5">
              <button className="w-12 h-12 rounded-full bg-slate-700 hover:bg-slate-800 flex items-center justify-center text-white"><svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348z"/></svg></button>
              <button className="w-12 h-12 rounded-full bg-slate-700 hover:bg-slate-800 flex items-center justify-center text-white"><svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.05-.2-.06-.06-.16-.04-.23-.02-.1.02-1.59 1.01-4.49 2.98-.42.29-.8.43-1.14.42-.38-.01-1.1-.22-1.64-.4-.66-.23-1.19-.35-1.14-.74.02-.2.29-.41.79-.63 3.12-1.36 5.2-2.26 6.24-2.7 2.97-1.24 3.59-1.45 3.99-1.46.09 0 .28.02.41.12.11.08.14.19.16.27-.01.06.01.24 0 .38z"/></svg></button>
              <button className="w-12 h-12 rounded-full bg-slate-700 hover:bg-slate-800 flex items-center justify-center text-white"><svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/></svg></button>
            </div><div className="flex gap-2"><button onClick={handleCopy} className="flex-1 flex items-center justify-center gap-2 text-sm py-2.5 bg-slate-50 hover:bg-slate-100 rounded-lg">{copied ? <CheckCircle className="w-4 h-4 text-slate-500" /> : <Copy className="w-4 h-4 text-slate-400" />}{copied ? "已复制" : "复制"}</button><button onClick={handleDownload} className="flex-1 flex items-center justify-center gap-2 text-sm py-2.5 bg-slate-50 hover:bg-slate-100 rounded-lg"><Download className="w-4 h-4 text-slate-400" />下载</button></div></div></div>)}
      </div>
    </div>
  );
}
