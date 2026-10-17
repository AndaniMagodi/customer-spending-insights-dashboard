import type { LucideIcon } from 'lucide-react'

interface KpiCardProps {
  title: string
  value: string
  detail: string
  icon: LucideIcon
  change?: number
  featured?: boolean
}

export function KpiCard({ title, value, detail, icon: Icon, change, featured = false }: KpiCardProps) {
  const cardStyle = featured
    ? 'min-w-0 rounded-2xl border border-emerald-800 bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-800 p-4 text-white shadow-lg shadow-emerald-950/10 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-xl sm:p-5'
    : 'dashboard-surface min-w-0 rounded-2xl border bg-white p-4 sm:p-5'

  return (
    <article className={cardStyle}>
      <div className="flex items-start justify-between gap-3">
        <p className={`text-sm font-medium ${featured ? 'text-emerald-100/80' : 'text-slate-500'}`}>{title}</p>
        <span className={`rounded-xl p-2 ${featured ? 'bg-white/10 text-white' : 'bg-emerald-50 text-emerald-800'}`}><Icon size={18} aria-hidden="true" /></span>
      </div>
      <p className={`mt-4 break-words text-xl font-bold tracking-tight sm:text-2xl ${featured ? 'text-white' : 'text-slate-900'}`}>{value}</p>
      <div className={`mt-2 flex items-center gap-1.5 text-xs ${featured ? 'text-emerald-100/75' : 'text-slate-500'}`}>
        {change !== undefined && <span className={`font-semibold ${change === 0 ? 'text-slate-400' : featured ? (change > 0 ? 'text-amber-200' : 'text-emerald-100') : (change > 0 ? 'text-amber-700' : 'text-emerald-700')}`}>{change > 0 ? '↑ +' : change < 0 ? '↓ ' : '→ '}{Math.abs(change)}%</span>}
        <span className="min-w-0">{detail}</span>
      </div>
    </article>
  )
}
