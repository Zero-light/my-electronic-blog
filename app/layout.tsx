import type { Metadata, Viewport } from 'next';
import { Layout } from '@/components/ui/layout';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { ReadingProgress } from '@/components/reading-progress';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Zerolight',
    template: '%s | Zerolight',
  },
  description:
    '面向电子信息/嵌入式工程师的个人网站，涵盖学习笔记、项目作品与在线简历。',
  keywords: ['嵌入式', '电子信息', '硬件设计', '作品集', '个人网站'],
  authors: [{ name: '任嘉庆' }],
  creator: '任嘉庆',
  metadataBase: new URL('https://www.zerolight.fun'),
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    siteName: 'Zerolight',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0d1117' },
  ],
  width: 'device-width',
  initialScale: 1,
};

/** 顶部导航栏配置（5 入口 + 搜索预留 + 主题切换） */
const navItems = [
  { href: '/', label: '首页' },
  { href: '/notes/', label: '笔记' },
  { href: '/projects/', label: '项目' },
  { href: '/resume/', label: '简历' },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        {/* 预加载 LCP 头像，加速首屏渲染 */}
        <link
          rel="preload"
          as="image"
          href="/images/avatar.webp"
          fetchPriority="high"
        />
      </head>
      <body>
        <ReadingProgress />
        <Layout
          header={{
            logo: (
              <span className="tracking-tight">
                <span className="text-primary">Zero</span>
                <span className="text-text">light</span>
              </span>
            ),
            items: navItems,
            right: (
              <div className="flex items-center gap-2">
                <ThemeToggle />
              </div>
            ),
          }}
        >
          {children}
        </Layout>
      </body>
    </html>
  );
}
