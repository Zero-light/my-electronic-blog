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
  authors: [{ name: '任炳宇' }],
  creator: '任炳宇',
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
          footer={{
            links: [
              { label: 'GitHub', href: 'https://github.com/Zero-light/my-electronic-blog' },
              { label: '个人网站', href: 'https://www.zerolight.fun' },
              { label: '邮箱', href: 'mailto:16696536769@163.com' },
            ],
            center: (
              <span>
                最后更新：{new Date().toLocaleDateString('zh-CN')}
              </span>
            ),
            copyright: `© ${new Date().getFullYear()} 任炳宇 版权所有`,
            disclaimer: '本站所有内容仅供学习交流，转载请注明出处。',
          }}
        >
          {children}
        </Layout>
      </body>
    </html>
  );
}
