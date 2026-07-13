'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, useMotionValueEvent, useScroll } from 'framer-motion';

export interface NavItem {
  href: string;
  label: string;
}

export interface HeaderProps {
  /** 左侧 Logo / 品牌区域 */
  logo: React.ReactNode;
  /** 导航项数组 */
  items: NavItem[];
  /** 右侧自定义内容（如搜索按钮、主题切换） */
  right?: React.ReactNode;
  className?: string;
}

/**
 * 通用顶部导航栏
 * - 固定悬浮、backdrop-blur 毛玻璃效果
 * - 桌面端横向链接，移动端自动折叠为汉堡菜单
 * - 当前页面高亮（基于 pathname 精确匹配）
 */
export function Header({ logo, items, right, className }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const { scrollY } = useScroll();

  useEffect(() => {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReduced) setIsVisible(true);
  }, []);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const prev = scrollY.getPrevious() ?? 0;
    if (latest < 60) {
      setIsVisible(true);
    } else if (latest > prev + 5) {
      setIsVisible(false);
    } else if (latest < prev - 5) {
      setIsVisible(true);
    }
  });

  return (
    <motion.header
      className={cn(
        'sticky top-0 z-50 border-b border-border/50 backdrop-blur-xl',
        'bg-[var(--bg)]/75 transition-all duration-300',
        'shadow-[0_1px_0_0_var(--border-subtle)]',
        className
      )}
      initial={false}
      animate={{ y: isVisible ? 0 : -56 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link
          href="/"
          className="text-lg font-bold text-primary transition-colors hover:text-primary-dark"
        >
          {logo}
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center space-x-1 md:flex">
          {items.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  active
                    ? 'bg-primary/10 text-primary'
                    : 'text-text-muted hover:bg-bg-soft hover:text-text'
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {right}

          {/* Mobile Hamburger */}
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-bg-soft hover:text-text md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="切换导航菜单"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileOpen && (
        <div className="border-t border-border bg-[var(--bg)] animate-fade-in md:hidden">
          <nav className="space-y-1 px-4 py-2">
            {items.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'block rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    active
                      ? 'bg-primary/10 text-primary'
                      : 'text-text-muted hover:bg-bg-soft hover:text-text'
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </motion.header>
  );
}
