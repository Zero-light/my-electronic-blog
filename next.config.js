/** @type {import('next').NextConfig} */
const nextConfig = {
  // 静态导出
  output: 'export',

  // 静态导出时关闭图片优化（由托管平台或用户自行处理图片体积）
  images: {
    unoptimized: true,
  },

  // 所有路由以 / 结尾，兼容各类静态托管平台的目录行为
  trailingSlash: true,

  // 支持 .mdx 作为页面扩展名
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],

  // ===== 生产优化 =====

  // 生产构建禁用 source map，大幅减小输出体积
  productionBrowserSourceMaps: false,

  // 移除 X-Powered-By 头
  poweredByHeader: false,

  // 生产构建移除 console.*（保留 error/warn）
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
      ? { exclude: ['error', 'warn'] }
      : false,
  },

  // 将大型依赖拆分为独立 chunk（减少首屏 JS 体积）
  experimental: {
    optimizePackageImports: [
      'framer-motion',
      'lucide-react',
      'prismjs',
    ],
  },
};

module.exports = nextConfig;
