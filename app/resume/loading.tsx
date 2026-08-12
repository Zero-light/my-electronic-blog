export default function ResumeLoading() {
  return (
    <div className="animate-fade-in space-y-12">
      <div className="flex flex-wrap gap-3">
        <div className="h-9 w-28 rounded-lg bg-bg-elevated skeleton-pulse" />
        <div className="h-9 w-20 rounded-lg bg-bg-elevated skeleton-pulse" />
      </div>
      <div className="flex items-start gap-5 border-b border-border pb-6">
        <div className="h-20 w-20 shrink-0 rounded-full bg-bg-elevated skeleton-pulse" />
        <div className="space-y-3">
          <div className="h-8 w-32 rounded bg-bg-elevated skeleton-pulse" />
          <div className="h-5 w-48 rounded bg-bg-elevated skeleton-pulse" />
          <div className="flex flex-wrap gap-4">
            <div className="h-4 w-24 rounded bg-bg-elevated skeleton-pulse" />
            <div className="h-4 w-40 rounded bg-bg-elevated skeleton-pulse" />
            <div className="h-4 w-32 rounded bg-bg-elevated skeleton-pulse" />
          </div>
        </div>
      </div>
      {Array.from({ length: 4 }).map((_, i) => (
        <section key={i} className="space-y-3">
          <div className="h-6 w-28 rounded bg-bg-elevated skeleton-pulse" />
          <div className="space-y-2">
            <div className="h-4 w-full rounded bg-bg-elevated skeleton-pulse" />
            <div className="h-4 w-5/6 rounded bg-bg-elevated skeleton-pulse" />
            <div className="h-4 w-2/3 rounded bg-bg-elevated skeleton-pulse" />
          </div>
        </section>
      ))}
    </div>
  );
}
