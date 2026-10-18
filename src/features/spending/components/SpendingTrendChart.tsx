import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { formatCurrency, formatMonth } from '../../../lib/format'
import type { SpendingTrend } from '../types'

export function SpendingTrendChart({ trends }: { trends: SpendingTrend[] }) {
  const data = trends.map((item) => ({ ...item, month: formatMonth(item.month) }))
  return (
    <section className="dashboard-surface min-w-0 rounded-2xl border bg-white p-5 sm:p-6">
      <div className="mb-5"><h2 className="font-semibold tracking-tight text-slate-900">Spending trend</h2><p className="mt-1 text-xs text-slate-500">Monthly spend · {data.length} months</p></div>
      {data.length === 0 ? (
        <p role="status" className="grid min-h-64 place-items-center text-center text-sm text-slate-500">No spending trend data is available yet.</p>
      ) : <div className="h-64 w-full" role="img" aria-label={`Area chart of monthly spending: ${data.map((item) => `${item.month} ${formatCurrency(item.totalSpent)}`).join(', ')}`}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
            <defs><linearGradient id="spendFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0b806b" stopOpacity={0.24} /><stop offset="95%" stopColor="#0b806b" stopOpacity={0.01} /></linearGradient></defs>
            <CartesianGrid vertical={false} stroke="#edf1ef" />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#82908b', fontSize: 12 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#82908b', fontSize: 11 }} tickFormatter={(value: number) => `R${Math.round(value / 1000)}k`} />
            <Tooltip formatter={(value) => [formatCurrency(Number(value)), 'Spent']} />
            <Area type="monotone" dataKey="totalSpent" stroke="#087e69" strokeWidth={3} fill="url(#spendFill)" activeDot={{ r: 5 }} animationDuration={650} animationEasing="ease-out" />
          </AreaChart>
        </ResponsiveContainer>
      </div>}
    </section>
  )
}
