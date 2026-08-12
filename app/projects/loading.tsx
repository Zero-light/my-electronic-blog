export default function ProjectsLoading() {
  return (
    <div className="animate-fade-in space-y-8">
      <div className="space-y-2">
        <div className="h-8 w-40 rounded bg-bg-elevated skeleton-pulse" />
      </div>
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-8 w-20 rounded-full bg-bg-elevated skeleton-pulse" />
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border/30 overflow-hidden">
            <div className="aspect-video bg-bg-elevated skeleton-pulse" />
            <div className="space-y-2 p-5">
              <div className="h-5 w-3/4 rounded bg-bg-elevated skeleton-pulse" />
              <div className="h-4 w-full rounded bg-bg-elevated skeleton-pulse" />
              <div className="flex gap-2">
                <div className="h-3 w-16 rounded bg-bg-elevated skeleton-pulse" />
                <div className="h-3 w-12 rounded bg-bg-elevated skeleton-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
