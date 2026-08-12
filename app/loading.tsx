/**
 * 全局路由加载骨架屏
 * - 页面导航 / 首次加载时立即显示，无需 JS 水合完成
 * - 使用纯 CSS 脉冲动画，零 JS 运行时
 * - 模拟页面布局，减少 CLS
 */
export default function Loading() {
  return (
    <div className="animate-fade-in space-y-12">
      {/* Hero 骨架 */}
      <div className="rounded-2xl border border-border/30 py-10 text-center">
        <div className="mx-auto max-w-2xl space-y-4 px-4">
          <div className="mx-auto h-24 w-24 rounded-full bg-bg-elevated skeleton-pulse" />
          <div className="mx-auto h-9 w-64 rounded-lg bg-bg-elevated skeleton-pulse" />
          <div className="mx-auto h-5 w-48 rounded-lg bg-bg-elevated skeleton-pulse" />
          <div className="space-y-2">
            <div className="mx-auto h-4 w-full max-w-lg rounded bg-bg-elevated skeleton-pulse" />
            <div className="mx-auto h-4 w-11/12 max-w-md rounded bg-bg-elevated skeleton-pulse" />
            <div className="mx-auto h-4 w-5/6 max-w-sm rounded bg-bg-elevated skeleton-pulse" />
          </div>
          <div className="flex flex-wrap justify-center gap-3 pt-1">
            <div className="h-9 w-28 rounded-lg bg-bg-elevated skeleton-pulse" />
            <div className="h-9 w-36 rounded-lg bg-bg-elevated skeleton-pulse" />
          </div>
        </div>
      </div>

      {/* 筛选标签骨架 */}
      <div className="flex flex-wrap items-center justify-center gap-2 md:justify-start">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-8 w-20 rounded-full bg-bg-elevated skeleton-pulse"
          />
        ))}
      </div>

      {/* 项目卡片骨架 */}
      <section>
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-8" />
        <div className="mb-6 flex items-center justify-between">
          <div className="h-6 w-32 rounded bg-bg-elevated skeleton-pulse" />
          <div className="h-8 w-20 rounded-full bg-bg-elevated skeleton-pulse" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[4/3] rounded-xl bg-bg-elevated skeleton-pulse"
            />
          ))}
        </div>
      </section>

      {/* 笔记骨架 */}
      <section>
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-8" />
        <div className="mb-6 flex items-center justify-between">
          <div className="h-6 w-32 rounded bg-bg-elevated skeleton-pulse" />
        </div>
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-20 rounded-xl bg-bg-elevated skeleton-pulse"
            />
          ))}
        </div>
      </section>
    </div>
  );
}
