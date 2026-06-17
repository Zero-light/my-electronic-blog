import { cn } from '@/lib/utils';

export interface TimelineItem {
  /** 日期/时间段 */
  date: string;
  /** 标题 */
  title: string;
  /** 副标题/地点 */
  subtitle?: string;
  /** 描述内容 */
  description?: string;
}

export interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

/**
 * 时间线组件
 * - 左侧竖线 + 圆点标记
 * - 按时间倒序排列（最新的在最上）
 * - 适配明暗主题与移动端
 */
export function Timeline({ items, className }: TimelineProps) {
  return (
    <div className={cn('relative pl-6', className)}>
      {/* 竖线 */}
      <div className="absolute left-[9px] top-2 bottom-2 w-0.5 bg-border" />

      <div className="space-y-8">
        {items.map((item, index) => (
          <div key={index} className="relative">
            {/* 圆点 */}
            <div className="absolute -left-6 top-1.5 flex h-5 w-5 items-center justify-center">
              <div className="h-3 w-3 rounded-full border-2 border-primary bg-bg" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-medium text-primary">
                {item.date}
              </span>
              <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                {item.title}
              </h4>
              {item.subtitle && (
                <p className="text-sm text-text-muted">{item.subtitle}</p>
              )}
              {item.description && (
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {item.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
