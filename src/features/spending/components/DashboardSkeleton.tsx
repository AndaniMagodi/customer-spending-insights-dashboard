function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-slate-200 ${className}`} />
}

export function DashboardSkeleton() {
  return <div className="space-y-5" aria-label="Loading spending dashboard" role="status"><Skeleton className="h-10 w-64" /><div className="flex gap-4 overflow-hidden">{Array.from({ length: 4 }, (_, index) => <Skeleton key={index} className="h-32 min-w-60 flex-1" />)}</div><div className="grid gap-5 xl:grid-cols-[1.5fr_1fr]"><Skeleton className="h-80" /><Skeleton className="h-80" /></div><Skeleton className="h-64" /><span className="sr-only">Loading spending data…</span></div>
}
