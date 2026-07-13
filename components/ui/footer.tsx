import { cn } from '@/lib/utils';
import { Github, Globe, Mail } from 'lucide-react';

export interface FooterProps {
  className?: string;
}

const SITE_LINKS = [
  { label: '首页', href: '/' },
  { label: '项目', href: '/projects/' },
  { label: '笔记', href: '/notes/' },
  { label: '简历', href: '/resume/' },
];

const CONTACT_LINKS = [
  { label: 'GitHub', href: 'https://github.com/Zero-light/my-electronic-blog', icon: <Github className="h-4 w-4" /> },
  { label: 'zerolight.fun', href: 'https://www.zerolight.fun', icon: <Globe className="h-4 w-4" /> },
  { label: '16696536769@163.com', href: 'mailto:16696536769@163.com', icon: <Mail className="h-4 w-4" /> },
];

/**
 * 三栏页脚：左=站点简介，中=快速入口，右=联系方式
 */
export function Footer({ className }: FooterProps) {
  return (
    <footer className={cn('border-t border-border mt-16', className)}>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {/* 三栏 */}
        <div className="grid gap-8 sm:grid-cols-3">
          {/* 左：站点简介 */}
          <div className="space-y-2">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Zerolight
            </p>
            <p className="text-xs leading-relaxed text-text-muted">
              嵌入式开发、电源硬件、PCB 调试的实践笔记与工程项目记录。
            </p>
          </div>

          {/* 中：快速入口 */}
          <div className="space-y-2">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              快速入口
            </p>
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              {SITE_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-xs text-text-muted transition-colors hover:text-primary"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* 右：联系方式 */}
          <div className="space-y-2">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              联系方式
            </p>
            <div className="space-y-1.5">
              {CONTACT_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith('http') ? '_blank' : undefined}
                  rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="flex items-center gap-2 text-xs text-text-muted transition-colors hover:text-primary"
                >
                  {link.icon}
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* 底部 */}
        <div className="mt-8 border-t border-border pt-5 text-center">
          <p className="text-xs text-text-muted">
            © {new Date().getFullYear()} 任炳宇 · 本站所有内容仅供学习交流，转载请注明
          </p>
        </div>
      </div>
    </footer>
  );
}
