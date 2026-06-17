'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { type ReactNode } from 'react';

/**
 * 主题 Provider 包装器
 * - attribute="class"：通过 HTML class="dark" 切换暗色模式
 * - defaultTheme="system"：默认跟随系统偏好
 * - enableSystem：允许检测系统主题
 * - disableTransitionOnChange={false}：切换时保留 CSS 过渡动画
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange={false}
    >
      {children}
    </NextThemesProvider>
  );
}
