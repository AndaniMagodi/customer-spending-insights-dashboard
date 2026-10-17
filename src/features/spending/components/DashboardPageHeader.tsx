import type { SpendingPeriod } from '../types'

interface DashboardPageHeaderProps {
  period: SpendingPeriod
  onPeriodChange: (period: SpendingPeriod) => void
}

export function DashboardPageHeader({ period, onPeriodChange }: DashboardPageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <p className="mb-2 flex items-center gap-2 text-xs font-bold tracking-[0.16em] text-emerald-800"><span className="size-1.5 rounded-full bg-emerald-600" aria-hidden="true" />YOUR MONEY, MADE CLEAR</p>
        <h1 className="text-3xl font-bold leading-tight tracking-tight text-slate-950 sm:text-4xl">Spending overview</h1>
        <p className="mt-2 text-sm text-slate-500">See where your money went and what’s changing.</p>
      </div>
      <label className="flex flex-col gap-1.5 text-xs font-semibold text-slate-600">Spending period
        <select value={period} onChange={(event) => onPeriodChange(event.target.value as SpendingPeriod)} className="h-11 min-w-40 rounded-xl border border-slate-200 bg-white px-3 text-sm shadow-sm transition hover:border-emerald-300 focus:border-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-700/10">
          <option value="7d">Last 7 days</option><option value="30d">Last 30 days</option><option value="90d">Last 90 days</option><option value="1y">Last year</option>
        </select>
      </label>
    </div>
  )
}
