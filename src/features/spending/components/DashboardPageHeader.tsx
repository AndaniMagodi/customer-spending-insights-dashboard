import type { FiltersResponse, SpendingPeriod } from '../types'

interface DashboardPageHeaderProps {
  period: SpendingPeriod
  onPeriodChange: (period: SpendingPeriod) => void
  presets: FiltersResponse['dateRangePresets']
}

export function DashboardPageHeader({ period, onPeriodChange, presets }: DashboardPageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <p className="mb-2 flex items-center gap-2 text-xs font-bold tracking-[0.16em] text-emerald-800"><span className="size-1.5 rounded-full bg-emerald-600" aria-hidden="true" />YOUR MONEY, MADE CLEAR</p>
        <h1 className="text-3xl font-bold leading-tight tracking-tight text-slate-950 sm:text-4xl">Spending overview</h1>
        <p className="mt-2 text-sm text-slate-500">See where your money went and what’s changing.</p>
      </div>
      <label className="flex flex-col gap-1.5 text-xs font-semibold text-slate-600">Spending period
        <select value={period} onChange={(event) => onPeriodChange(event.target.value as SpendingPeriod)} className="h-11 min-w-40 rounded-xl border border-slate-200 bg-white px-3 text-sm shadow-sm transition hover:border-emerald-300 focus:border-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-700/10">
          {presets.map((preset) => <option key={preset.value} value={preset.value}>{preset.label}</option>)}
        </select>
      </label>
    </div>
  )
}
