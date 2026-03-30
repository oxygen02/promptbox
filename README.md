# PromptBox - AI 提示词分析与生成工具

[English](#english) | [中文](#中文)

---

## 中文

PromptBox 是一款多模态提示词分析与生成工具，支持文字、图片、视频、网页内容分析，AI 智能生成可复用提示词。

### 功能特性

- 📤 **多格式上传**：支持文件上传、URL 输入、Ctrl+V 粘贴
- 🤖 **AI 分析**：基于上传内容智能分析，提取关键信息
- 🎯 **维度选择**：12+ 分析维度可选（信息提炼、风格复刻、结构梳理等）
- 📝 **提示词生成**：生成可编辑的 AI 提示词模板
- 🌐 **多语言支持**：中文/英文双语切换
- 📱 **响应式设计**：支持移动端访问

### 技术栈

- **前端**：Next.js 14 + TypeScript + Tailwind CSS
- **后端**：Express.js（可选）
- **部署**：腾讯云服务器

### 快速开始

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 生产构建
npm run build
```

### 环境变量

创建 `.env` 文件：

```
CODING_PLAN_API_KEY=your_api_key_here
```

### 版本

- v1.0.3 - 提示词维度优化、社交分享、布局调整
- v1.0.2 - 初始版本

---

## English

PromptBox is a multimodal prompt analysis and generation tool that supports analyzing text, images, video, and web content to generate reusable AI prompts.

### Features

- 📤 **Multi-format Upload**: File upload, URL input, Ctrl+V paste
- 🤖 **AI Analysis**: Intelligent analysis of uploaded content
- 🎯 **Dimension Selection**: 12+ analysis dimensions
- 📝 **Prompt Generation**: Editable AI prompt templates
- 🌐 **Multilingual**: Chinese/English bilingual support
- 📱 **Responsive Design**: Mobile-friendly

### Tech Stack

- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Backend**: Express.js (optional)
- **Deployment**: Tencent Cloud Server

### Quick Start

```bash
# Install dependencies
npm install

# Development
npm run dev

# Production build
npm run build
```

### License

MIT
