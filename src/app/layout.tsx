import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PromptBox - AI提示词分析与生成工具",
  description: "上传内容，AI分析生成可复用的提示词，支持二次创作",
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
          <main className="flex-1 md:ml-60 min-h-[calc(100vh-4rem)]">{children}</main>
        </div>
      </body>
    </html>
  );
}
