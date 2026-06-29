import type { Metadata } from 'next';
import Link from 'next/link';
import { ThemeProvider } from 'next-themes';
import { BookOpen, Home, PenLine, FolderCode } from 'lucide-react';
import './globals.css';

export const metadata: Metadata = {
  title: '知识库 | Newman Dryden',
  description: '硬件调试笔记与技术积累',
};

const navItems = [
  { href: '/', label: '首页', icon: Home },
  { href: '/notes/', label: '知识库', icon: BookOpen },
  { href: '/life/essays/', label: '随笔', icon: PenLine },
  { href: '/projects/', label: '项目', icon: FolderCode },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="min-h-screen bg-bg">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="mx-auto max-w-3xl px-6 py-8">
            <header className="mb-12">
              <nav className="flex items-center gap-6">
                {navItems.map(item => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-1.5 text-sm text-text-muted transition-colors hover:text-primary"
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                ))}
              </nav>
            </header>
            <main>{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
