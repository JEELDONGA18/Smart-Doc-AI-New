export function SkeletonLine({ className = "" }) {
  return (
    <div className={`h-4 rounded-lg bg-white/[0.04] animate-pulse ${className}`} />
  );
}

export function SkeletonCard({ className = "" }) {
  return (
    <div className={`rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 space-y-4 ${className}`}>
      <div className="h-4 w-1/3 rounded-lg bg-white/[0.06] animate-pulse" />
      <div className="h-8 w-2/3 rounded-lg bg-white/[0.04] animate-pulse" />
      <div className="h-3 w-1/2 rounded-lg bg-white/[0.03] animate-pulse" />
    </div>
  );
}

export function SkeletonChat() {
  return (
    <div className="space-y-6 p-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"}`}>
          <div className={`rounded-2xl p-4 space-y-2 ${i % 2 === 0 ? "w-2/3" : "w-1/2"}`}>
            <div className="h-3 rounded bg-white/[0.04] animate-pulse" />
            <div className="h-3 w-3/4 rounded bg-white/[0.03] animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function SkeletonTable({ rows = 5 }) {
  return (
    <div className="space-y-3">
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02]">
          <div className="h-10 w-10 rounded-lg bg-white/[0.04] animate-pulse shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-1/3 rounded bg-white/[0.06] animate-pulse" />
            <div className="h-2 w-1/4 rounded bg-white/[0.03] animate-pulse" />
          </div>
          <div className="h-8 w-20 rounded-lg bg-white/[0.04] animate-pulse" />
        </div>
      ))}
    </div>
  );
}
