/** @type {import('next').NextConfig} */
const nextConfig = {
  // 纯静态导出，无需 Node.js 运行时
  output: 'export',

  // 静态导出时关闭图片优化（由托管平台或用户自行处理图片体积）
  images: {
    unoptimized: true,
  },

  // 所有路由以 / 结尾，兼容各类静态托管平台的目录行为
  trailingSlash: true,

  // 支持 .mdx 作为页面扩展名
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
};

module.exports = nextConfig;
