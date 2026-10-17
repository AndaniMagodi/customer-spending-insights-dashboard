import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { formatCurrency, formatRoundedCurrency } from '../../../lib/format'
import { CategoryIcon } from './CategoryIcon'
import type { CategoriesResponse, SpendingCategory } from '../types'

type DateRange = CategoriesResponse['dateRange']

function formatDateRange({ startDate, endDate }: DateRange) {
  const start = new Date(`${startDate}T12:00:00`)
  const end = new Date(`${endDate}T12:00:00`)
  const parts = (date: Date) => Object.fromEntries(
    new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
      .formatToParts(date)
      .map(({ type, value }) => [type, value]),
  )
  const from = parts(start)
  const to = parts(end)
  const includeYear = end.getFullYear() !== new Date().getFullYear()

  if (start.getFullYear() === end.getFullYear() && start.getMonth() === end.getMonth()) {
    return `${from.day}–${to.day} ${to.month}${includeYear ? ` ${to.year}` : ''}`
  }

  const startLabel = `${from.day} ${from.month}${start.getFullYear() !== end.getFullYear() ? ` ${from.year}` : ''}`
  const endLabel = `${to.day} ${to.month}${includeYear ? ` ${to.year}` : ''}`
  return `${startLabel} – ${endLabel}`
}

export function CategoryBreakdown({ categories, dateRange }: { categories: SpendingCategory[]; dateRange?: DateRange }) {
  const total = categories.reduce((sum, item) => sum + item.amount, 0)
  const formattedTotal = formatRoundedCurrency(total)

  return (
    <section className="dashboard-surface min-w-0 rounded-2xl border bg-white p-5 sm:p-6">
      <div className="mb-4"><h2 className="font-semibold tracking-tight text-slate-900">Spending by category</h2><p className="mt-1 text-xs text-slate-500">{dateRange ? `Category share, ${formatDateRange(dateRange)}` : 'Category share for this period'}</p></div>
      {categories.length === 0 ? (
        <p role="status" className="grid min-h-52 place-items-center text-center text-sm text-slate-500">No category spending is available for this period.</p>
      ) : <div className="flex flex-col items-center gap-4 sm:flex-row xl:flex-col 2xl:flex-row">
        <div className="relative h-52 w-full max-w-56 shrink-0" role="img" aria-label={`Donut chart showing spending by category, total ${formatCurrency(total)}`}>
          <ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={categories} dataKey="amount" nameKey="name" innerRadius={62} outerRadius={88} paddingAngle={2} stroke="none" animationDuration={650} animationEasing="ease-out">{categories.map((item) => <Cell key={item.name} fill={item.color} />)}</Pie><Tooltip formatter={(value) => formatCurrency(Number(value))} /></PieChart></ResponsiveContainer>
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"><span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-400">Total</span><span className="mt-1 text-sm font-bold tracking-tight text-slate-800">{formattedTotal}</span></div>
        </div>
        <ul className="w-full space-y-1">{categories.map((item) => <li key={item.name} className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs transition-colors hover:bg-slate-50"><span className="grid size-7 shrink-0 place-items-center rounded-lg bg-slate-50"><CategoryIcon name={item.icon} color={item.color} size={15} /></span><span className="min-w-0 flex-1 truncate text-slate-600">{item.name}</span><span className="font-semibold tabular-nums text-slate-800">{formatCurrency(item.amount)}</span></li>)}</ul>
      </div>}
    </section>
  )
}
