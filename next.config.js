/** @type {import('next').NextConfig} */
const nextConfig = {
  // 静态导出配置（用于 Cloudflare Pages）
  output: 'export',
  // 使用默认输出目录 out
  
  // 图片优化配置（静态导出需要禁用）
  images: {
    unoptimized: true,
  },
  
  // 环境变量 - 前端调用后端 API 地址
  env: {
    NEXT_PUBLIC_API_BASE: process.env.NEXT_PUBLIC_API_BASE || 'http://124.156.200.127:3002',
  },
};

module.exports = nextConfig;
