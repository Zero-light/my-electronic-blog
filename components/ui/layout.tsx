import { type ReactNode } from 'react';
import { ThemeProvider } from '@/components/providers';
import { Header, type HeaderProps } from './header';
import { Footer, type FooterProps } from './footer';
import { cn } from '@/lib/utils';

export interface LayoutProps {
  children: ReactNode;
  header: HeaderProps;
  footer?: FooterProps;
  mainClassName?: string;
}

/**
 * 全局布局骨架
 * - ThemeProvider 包裹全站
 * - Header 固定顶部
 * - main 内容区自适应高度（flex-1）
 * - Footer 固定底部
 * - 所有业务数据通过 props 传入，组件本身零业务硬编码
 */
export function Layout({ children, header, footer, mainClassName }: LayoutProps) {
  return (
    <ThemeProvider>
      <div className="flex min-h-screen flex-col">
        <Header {...header} />

        <main
          className={cn(
            'mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6',
            mainClassName
          )}
        >
          {children}
        </main>

        {footer && <Footer {...footer} />}
      </div>
    </ThemeProvider>
  );
}
