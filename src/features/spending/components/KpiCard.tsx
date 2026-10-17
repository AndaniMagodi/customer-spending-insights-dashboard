import type { LucideIcon } from 'lucide-react'

interface KpiCardProps {
  title: string
  value: string
  detail: string
  icon: LucideIcon
  change?: number
}

export function KpiCard({ title, value, detail, icon: Icon, change }: KpiCardProps) {
  return (
    <article className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <span className="rounded-xl bg-emerald-50 p-2 text-emerald-800"><Icon size={18} aria-hidden="true" /></span>
      </div>
      <p className="mt-4 break-words text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">{value}</p>
      <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
        {change !== undefined && <span className={change > 0 ? 'font-semibold text-amber-700' : 'font-semibold text-emerald-700'}>{change > 0 ? '↑' : '↓'} {Math.abs(change)}%</span>}
        <span className="min-w-0">{detail}</span>
      </div>
    </article>
  )
}
