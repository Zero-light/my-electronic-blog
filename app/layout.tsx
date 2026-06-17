import type { Metadata, Viewport } from 'next';
import { Layout } from '@/components/ui/layout';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { SearchBox } from '@/components/search-box';
import { buildSearchIndex } from '@/lib/search-index';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: '零光驿站',
    template: '%s | 零光驿站',
  },
  description:
    '面向电子信息/嵌入式工程师的个人网站，涵盖学习笔记、项目作品、生活随笔与在线简历。',
  keywords: ['嵌入式', '电子信息', '硬件设计', '作品集', '个人网站'],
  authors: [{ name: '零光' }],
  creator: '零光',
  metadataBase: new URL('https://example.com'),
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    siteName: '零光驿站',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
  width: 'device-width',
  initialScale: 1,
};

/** 顶部导航栏配置（6 入口 + 搜索预留 + 主题切换） */
const navItems = [
  { href: '/', label: '首页' },
  { href: '/notes/', label: '笔记' },
  { href: '/projects/', label: '项目' },
  { href: '/life/', label: '生活' },
  { href: '/about/', label: '关于' },
  { href: '/resume/', label: '简历' },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const searchIndex = buildSearchIndex();

  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body>
        <Layout
          header={{
            logo: (
              <span className="tracking-tight">
                <span className="text-primary">零光</span>
                <span className="text-text">驿站</span>
              </span>
            ),
            items: navItems,
            right: (
              <div className="flex items-center gap-2">
                <SearchBox index={searchIndex} />
                <ThemeToggle />
              </div>
            ),
          }}
          footer={{
            links: [
              { label: 'GitHub', href: 'https://github.com' },
              { label: '邮箱', href: 'mailto:example@example.com' },
            ],
            center: (
              <span>
                最后更新：{new Date().toLocaleDateString('zh-CN')}
              </span>
            ),
            copyright: `© ${new Date().getFullYear()} 零光 版权所有`,
            disclaimer: '本站所有内容仅供学习交流，转载请注明出处。',
          }}
        >
          {children}
        </Layout>
      </body>
    </html>
  );
}
