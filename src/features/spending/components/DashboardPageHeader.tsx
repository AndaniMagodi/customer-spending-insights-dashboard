import type { SpendingPeriod } from '../types'

interface DashboardPageHeaderProps {
  period: SpendingPeriod
  onPeriodChange: (period: SpendingPeriod) => void
}

export function DashboardPageHeader({ period, onPeriodChange }: DashboardPageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div><p className="mb-2 text-xs font-bold tracking-[0.16em] text-emerald-800">YOUR MONEY, MADE CLEAR</p><h1 className="text-3xl font-bold tracking-tight">Spending overview</h1><p className="mt-2 text-sm text-slate-500">See where your money went and what’s changing.</p></div>
      <label className="flex flex-col gap-1.5 text-xs font-semibold text-slate-600">Spending period
        <select value={period} onChange={(event) => onPeriodChange(event.target.value as SpendingPeriod)} className="h-10 min-w-40 rounded-xl border border-slate-200 bg-white px-3 text-sm">
          <option value="7d">Last 7 days</option><option value="30d">Last 30 days</option><option value="90d">Last 90 days</option><option value="1y">Last year</option>
        </select>
      </label>
    </div>
  )
}
