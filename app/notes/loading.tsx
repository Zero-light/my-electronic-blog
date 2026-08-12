export default function NotesLoading() {
  return (
    <div className="animate-fade-in space-y-8">
      <div className="space-y-2">
        <div className="h-8 w-40 rounded bg-bg-elevated skeleton-pulse" />
        <div className="h-5 w-72 rounded bg-bg-elevated skeleton-pulse" />
      </div>
      <div className="h-10 w-full rounded-lg bg-bg-elevated skeleton-pulse" />
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-8 w-24 rounded-full bg-bg-elevated skeleton-pulse" />
        ))}
      </div>
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex gap-4 rounded-xl border border-border/30 p-4">
            <div className="h-16 w-24 shrink-0 rounded-lg bg-bg-elevated skeleton-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-20 rounded-full bg-bg-elevated skeleton-pulse" />
              <div className="h-5 w-3/4 rounded bg-bg-elevated skeleton-pulse" />
              <div className="h-4 w-full rounded bg-bg-elevated skeleton-pulse" />
              <div className="flex gap-2">
                <div className="h-4 w-16 rounded bg-bg-elevated skeleton-pulse" />
                <div className="h-4 w-12 rounded bg-bg-elevated skeleton-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
