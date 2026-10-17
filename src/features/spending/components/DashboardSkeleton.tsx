function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-slate-200 ${className}`} />
}

function TrendSkeleton() {
  return (
    <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <Skeleton className="h-5 w-36" />
      <Skeleton className="mt-2 h-3 w-44" />
      <div className="relative mt-5 h-64 overflow-hidden rounded-lg">
        <Skeleton className="absolute inset-x-0 top-1/4 h-px rounded-none" />
        <Skeleton className="absolute inset-x-0 top-2/4 h-px rounded-none" />
        <Skeleton className="absolute inset-x-0 top-3/4 h-px rounded-none" />
      </div>
    </section>
  )
}

function CategorySkeleton() {
  return (
    <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <Skeleton className="h-5 w-40" />
      <Skeleton className="mt-2 h-3 w-44" />
      <div className="mt-4 flex flex-col items-center gap-4 sm:flex-row xl:flex-col">
        <Skeleton className="size-52 max-w-full shrink-0 rounded-full" />
        <div className="w-full space-y-4">
          {Array.from({ length: 6 }, (_, index) => (
            <div key={index} className="flex items-center gap-3">
              <Skeleton className="size-2.5 rounded-full" />
              <Skeleton className="h-3 min-w-0 flex-1" />
              <Skeleton className="h-3 w-20" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function TransactionsSkeleton() {
  return (
    <section className="space-y-4 rounded-2xl border border-slate-200 bg-white px-5 py-5 shadow-sm sm:px-6">
      <div>
        <Skeleton className="h-5 w-40" />
        <Skeleton className="mt-2 h-3 w-full max-w-md" />
      </div>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-[minmax(12rem,1fr)_12rem_12rem]">
        <Skeleton className="col-span-2 h-10 lg:col-span-1" />
        <Skeleton className="h-10" />
        <Skeleton className="h-10" />
      </div>
      <div className="flex flex-col gap-3 rounded-xl bg-slate-50 p-3 sm:flex-row sm:items-end">
        <div className="min-w-0 flex-1">
          <Skeleton className="mb-2 h-3 w-32" />
          <div className="grid grid-cols-2 gap-3">
            <Skeleton className="h-10" />
            <Skeleton className="h-10" />
          </div>
        </div>
        <div className="flex gap-2 sm:shrink-0">
          <Skeleton className="h-10 flex-1 sm:w-24 sm:flex-none" />
          <Skeleton className="h-10 flex-1 sm:w-24 sm:flex-none" />
        </div>
      </div>
      <div className="divide-y divide-slate-100 border-y border-slate-100">
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 py-4 sm:grid-cols-[minmax(0,1.2fr)_minmax(6rem,.8fr)_minmax(6rem,.8fr)_auto]">
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-32 sm:hidden" />
            </div>
            <Skeleton className="hidden h-3 w-20 sm:block" />
            <Skeleton className="hidden h-3 w-24 sm:block" />
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </div>
    </section>
  )
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-5">
      <span className="sr-only" role="status" aria-live="polite">Loading spending data…</span>
      <div aria-hidden="true" className="space-y-5">
        <div className="space-y-2">
          <Skeleton className="h-3 w-40" />
          <Skeleton className="h-9 w-64 max-w-full" />
          <Skeleton className="h-4 w-72 max-w-full" />
        </div>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => <Skeleton key={index} className="h-36 sm:h-40" />)}
        </div>
        <div className="grid min-w-0 gap-5 xl:grid-cols-[1.55fr_1fr]">
          <TrendSkeleton />
          <CategorySkeleton />
        </div>
        <TransactionsSkeleton />
      </div>
    </div>
  )
}
