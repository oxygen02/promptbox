import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PromptBox Pro - AI 提示词分析与生成工具",
  description: "多模态提示词分析与生成工具，支持文字、图片、视频、网页内容分析，AI 智能生成可复用提示词",
  keywords: "AI, 提示词, Prompt, 生成, 分析, DeepSeek, Kimi, MiniMax",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh">
      <body className={inter.className}>
        <Header />
        <div className="flex pt-16">
          <Sidebar />
          <main className="flex-1 md:ml-60 min-h-[calc(100vh-4rem)] p-8">
            <Suspense fallback={
              <div className="flex items-center justify-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600"></div>
              </div>
            }>
              {children}
            </Suspense>
          </main>
        </div>
      </body>
    </html>
  );
}
