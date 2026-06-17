import { cn } from '@/lib/utils';

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterProps {
  /** 左侧链接组（如邮箱、GitHub） */
  links?: FooterLink[];
  /** 中间内容（如更新时间） */
  center?: React.ReactNode;
  /** 版权信息 */
  copyright?: string;
  /** 底部免责声明 */
  disclaimer?: string;
  className?: string;
}

/**
 * 通用页脚
 * - 上部分：链接组 + 中间信息（水平排列，移动端堆叠）
 * - 下部分：版权 + 免责声明
 * - 所有内容均通过 props 传入，零业务硬编码
 */
export function Footer({
  links,
  center,
  copyright,
  disclaimer,
  className,
}: FooterProps) {
  return (
    <footer className={cn('border-t border-border mt-16', className)}>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {/* Top Row */}
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          {links && links.length > 0 && (
            <div className="flex flex-wrap items-center gap-6">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-text-muted transition-colors hover:text-primary"
                >
                  {link.label}
                </a>
              ))}
            </div>
          )}

          {center && (
            <div className="text-sm text-text-muted">{center}</div>
          )}
        </div>

        {/* Bottom Row */}
        <div className="mt-6 border-t border-border pt-6 text-center">
          {disclaimer && (
            <p className="text-xs text-text-muted">{disclaimer}</p>
          )}
          {copyright && (
            <p className="mt-1 text-xs text-text-muted">{copyright}</p>
          )}
        </div>
      </div>
    </footer>
  );
}
