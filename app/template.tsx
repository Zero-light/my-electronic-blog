/**
 * App Router 页面切换过渡
 * - 每次路由切换触发淡入+轻微上滑（纯 CSS，零 JS 运行时）
 * - 模板 remount 自然触发 animation 重播
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-transition">{children}</div>;
}
