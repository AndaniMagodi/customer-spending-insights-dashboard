import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { SpendingTrend } from '../types'

const currency = (value: number) => new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(value)

export function SpendingTrendChart({ trends }: { trends: SpendingTrend[] }) {
  const data = trends.map((item) => ({ ...item, month: new Intl.DateTimeFormat('en', { month: 'short' }).format(new Date(`${item.month}-01T00:00:00`)) }))
  return (
    <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5"><h2 className="font-semibold text-slate-900">Spending trend</h2><p className="mt-1 text-xs text-slate-500">Monthly spend over time</p></div>
      {data.length === 0 ? (
        <p role="status" className="grid min-h-64 place-items-center text-center text-sm text-slate-500">No spending trend data is available yet.</p>
      ) : <div className="h-64 w-full" role="img" aria-label={`Area chart of monthly spending: ${data.map((item) => `${item.month} ${currency(item.totalSpent)}`).join(', ')}`}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
            <defs><linearGradient id="spendFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0b806b" stopOpacity={0.24} /><stop offset="95%" stopColor="#0b806b" stopOpacity={0.01} /></linearGradient></defs>
            <CartesianGrid vertical={false} stroke="#edf1ef" />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#82908b', fontSize: 12 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#82908b', fontSize: 11 }} tickFormatter={(value: number) => `R${Math.round(value / 1000)}k`} />
            <Tooltip formatter={(value) => [currency(Number(value)), 'Spent']} />
            <Area type="monotone" dataKey="totalSpent" stroke="#087e69" strokeWidth={3} fill="url(#spendFill)" activeDot={{ r: 5 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>}
    </section>
  )
}
