import { useState } from 'react'
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Bell,
  ChevronDown,
  CircleHelp,
  CreditCard,
  LayoutDashboard,
  Menu,
  Settings,
  Wallet,
  X,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  fetchDashboardData,
  type Period,
  type Transaction,
} from './features/dashboard/mock-data'

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    maximumFractionDigits: 2,
  }).format(amount)

const navigation: { label: string; icon: LucideIcon; active?: boolean }[] = [
  { label: 'Overview', icon: LayoutDashboard, active: true },
  { label: 'Transactions', icon: CreditCard },
  { label: 'Insights', icon: Activity },
]

function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-slate-200 ${className}`} />
}

function DashboardSkeleton() {
  return (
    <div className="space-y-5" aria-label="Loading spending dashboard" role="status">
      <Skeleton className="h-10 w-64" />
      <div className="flex gap-4 overflow-hidden">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton key={index} className="h-32 min-w-60 flex-1" />
        ))}
      </div>
      <div className="grid gap-5 xl:grid-cols-[1.5fr_1fr]">
        <Skeleton className="h-80" />
        <Skeleton className="h-80" />
      </div>
      <Skeleton className="h-64" />
      <span className="sr-only">Loading your spending data…</span>
    </div>
  )
}

function KpiCard({
  title,
  value,
  detail,
  icon: Icon,
  change,
}: {
  title: string
  value: string
  detail: string
  icon: LucideIcon
  change?: number
}) {
  const isIncrease = change !== undefined && change > 0

  return (
    <article className="min-w-60 flex-1 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:min-w-0">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <span className="rounded-xl bg-emerald-50 p-2 text-emerald-800">
          <Icon size={18} aria-hidden="true" />
        </span>
      </div>
      <p className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
        {value}
      </p>
      <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
        {change !== undefined && (
          <span
            className={`inline-flex items-center font-semibold ${
              isIncrease ? 'text-amber-700' : 'text-emerald-700'
            }`}
          >
            {isIncrease ? (
              <ArrowUpRight size={14} aria-hidden="true" />
            ) : (
              <ArrowDownRight size={14} aria-hidden="true" />
            )}
            {Math.abs(change)}%
          </span>
        )}
        <span>{detail}</span>
      </div>
    </article>
  )
}

function TransactionRow({
  transaction,
}: {
  transaction: Transaction
}) {
  const [expanded, setExpanded] = useState(false)

  return (
    <>
      <tr className="border-t border-slate-100">
        <td className="whitespace-nowrap px-4 py-4 font-semibold text-slate-800">
          <button
            type="button"
            className="text-left hover:text-emerald-800"
            aria-expanded={expanded}
            onClick={() => setExpanded((value) => !value)}
          >
            {transaction.merchant}
          </button>
        </td>
        <td className="hidden whitespace-nowrap px-4 py-4 text-slate-600 sm:table-cell">
          {transaction.category}
        </td>
        <td className="whitespace-nowrap px-4 py-4 text-slate-600">
          {transaction.date}
        </td>
        <td className="whitespace-nowrap px-4 py-4 text-right font-semibold text-slate-800">
          {formatCurrency(transaction.amount)}
        </td>
        <td className="hidden px-4 py-4 sm:table-cell">
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-medium ${
              transaction.status === 'Pending'
                ? 'bg-amber-50 text-amber-800'
                : 'bg-emerald-50 text-emerald-800'
            }`}
          >
            {transaction.status}
          </span>
        </td>
      </tr>
      {expanded && (
        <tr className="sm:hidden">
          <td colSpan={5} className="bg-slate-50 px-4 py-3 text-xs text-slate-600">
            {transaction.category} · {transaction.paymentMethod} · {transaction.status}
          </td>
        </tr>
      )}
    </>
  )
}

function App() {
  const [period, setPeriod] = useState<Period>('30d')
  const [menuOpen, setMenuOpen] = useState(false)

  const { data, isPending, isError, error, refetch, isFetching } = useQuery({
    queryKey: ['dashboard', period],
    queryFn: () => fetchDashboardData(period),
  })

  return (
    <div className="min-h-screen bg-[#f6f8f7] text-slate-900">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-60 flex-col border-r border-slate-200 bg-white px-4 py-6 md:flex">
        <a href="#overview" className="mb-10 flex items-center gap-3 px-2">
          <span className="grid size-10 place-items-center rounded-xl bg-emerald-800 text-lg font-bold text-white">
            S
          </span>
          <span className="font-bold tracking-tight text-slate-900">
            Spending insights
          </span>
        </a>

        <p className="px-3 pb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Menu
        </p>
        <nav aria-label="Main navigation" className="space-y-1">
          {navigation.map(({ label, icon: Icon, active }) => (
            <a
              key={label}
              href={`#${label.toLowerCase()}`}
              aria-current={active ? 'page' : undefined}
              className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium ${
                active
                  ? 'bg-emerald-50 text-emerald-900'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon size={18} aria-hidden="true" />
              {label}
            </a>
          ))}
        </nav>

        <div className="mt-auto space-y-1 border-t border-slate-100 pt-4">
          <a href="#help" className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-500 hover:bg-slate-50">
            <CircleHelp size={18} aria-hidden="true" /> Help
          </a>
          <a href="#settings" className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-500 hover:bg-slate-50">
            <Settings size={18} aria-hidden="true" /> Settings
          </a>
        </div>
      </aside>

      <div className="md:pl-60">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-7">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <span className="font-semibold text-slate-800 md:hidden">
              Spending insights
            </span>
            <span className="hidden text-sm text-slate-500 md:inline">
              Personal banking / Spending
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              aria-label="Notifications"
            >
              <Bell size={19} />
            </button>
            <span className="grid size-9 place-items-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-900">
              JD
            </span>
            <span className="hidden text-sm font-medium text-slate-700 sm:inline">
              Jordan Davis
            </span>
            <ChevronDown size={16} className="hidden text-slate-400 sm:block" />
          </div>
        </header>

        {menuOpen && (
          <nav className="border-b border-slate-200 bg-white px-4 py-3 md:hidden" aria-label="Mobile navigation">
            {navigation.map(({ label, icon: Icon }) => (
              <a
                key={label}
                href={`#${label.toLowerCase()}`}
                className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-slate-700"
                onClick={() => setMenuOpen(false)}
              >
                <Icon size={18} aria-hidden="true" /> {label}
              </a>
            ))}
            <a href="#settings" className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-slate-700">
              <Settings size={18} aria-hidden="true" /> Settings
            </a>
          </nav>
        )}

        <main id="overview" className="mx-auto max-w-7xl px-4 pb-28 pt-7 sm:px-7 sm:pt-9 md:pb-10">
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="mb-2 text-xs font-bold tracking-[0.16em] text-emerald-800">
                YOUR MONEY, MADE CLEAR
              </p>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                Spending overview
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                See where your money went and what’s changing.
              </p>
            </div>
            <label className="flex flex-col gap-1.5 text-xs font-semibold text-slate-600">
              Spending period
              <select
                value={period}
                onChange={(event) => setPeriod(event.target.value as Period)}
                className="h-10 min-w-40 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-800 shadow-sm"
              >
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
            </label>
          </div>

          {isPending ? (
            <DashboardSkeleton />
          ) : isError ? (
            <section className="rounded-2xl border border-rose-200 bg-white p-6" role="alert">
              <h2 className="font-semibold text-rose-900">Spending data is unavailable</h2>
              <p className="mt-2 text-sm text-slate-600">{error.message}</p>
              <button
                type="button"
                onClick={() => void refetch()}
                className="mt-4 rounded-lg bg-emerald-800 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-900"
              >
                Try again
              </button>
            </section>
          ) : data ? (
            <div className="space-y-5">
              <section aria-label="Spending summary" className="flex snap-x gap-3 overflow-x-auto pb-1 md:grid md:grid-cols-2 md:overflow-visible lg:grid-cols-4">
                <KpiCard
                  title="Total spent"
                  value={formatCurrency(data.totalSpent)}
                  detail="compared with previous period"
                  change={data.previousPeriodChange}
                  icon={Wallet}
                />
                <KpiCard
                  title="Average transaction"
                  value={formatCurrency(data.averageTransaction)}
                  detail={`${data.transactionCount} transactions`}
                  icon={CreditCard}
                />
                <KpiCard
                  title="Top category"
                  value={data.topCategory}
                  detail="highest spending this period"
                  icon={Activity}
                />
                <KpiCard
                  title="Budget used"
                  value={`${Math.min((data.totalSpent / data.monthlyBudget) * 100, 100).toFixed(1)}%`}
                  detail={`of ${formatCurrency(data.monthlyBudget)} monthly budget`}
                  icon={Wallet}
                />
              </section>

              <section className="grid gap-5 xl:grid-cols-[1.55fr_1fr]">
                <article className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                  <div className="mb-5 flex items-start justify-between gap-4">
                    <div>
                      <h2 className="font-semibold text-slate-900">Spending trend</h2>
                      <p className="mt-1 text-xs text-slate-500">Monthly spend over time</p>
                    </div>
                    {isFetching && <span className="text-xs text-slate-400">Updating…</span>}
                  </div>
                  <div className="h-64 w-full" aria-label="Monthly spending area chart">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={data.trend} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                        <defs>
                          <linearGradient id="spendFill" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#0b806b" stopOpacity={0.24} />
                            <stop offset="95%" stopColor="#0b806b" stopOpacity={0.01} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} stroke="#edf1ef" />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#82908b', fontSize: 12 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#82908b', fontSize: 11 }} tickFormatter={(value: number) => `R${Math.round(value / 1000)}k`} />
                        <Tooltip formatter={(value) => [formatCurrency(Number(value)), 'Spent']} />
                        <Area type="monotone" dataKey="amount" stroke="#087e69" strokeWidth={3} fill="url(#spendFill)" activeDot={{ r: 5 }} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </article>

                <article className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                  <div className="mb-4">
                    <h2 className="font-semibold text-slate-900">Spending by category</h2>
                    <p className="mt-1 text-xs text-slate-500">Category share for this period</p>
                  </div>
                  <div className="flex flex-col items-center gap-4 sm:flex-row xl:flex-col 2xl:flex-row">
                    <div className="h-52 w-full max-w-56 shrink-0" aria-label="Spending by category donut chart">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={data.categories} dataKey="amount" nameKey="name" innerRadius={62} outerRadius={88} paddingAngle={2} stroke="none">
                            {data.categories.map((category) => (
                              <Cell key={category.name} fill={category.color} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <ul className="w-full space-y-3">
                      {data.categories.map((category) => (
                        <li key={category.name} className="flex items-center gap-2 text-xs">
                          <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: category.color }} />
                          <span className="min-w-0 flex-1 truncate text-slate-600">{category.name}</span>
                          <span className="font-semibold text-slate-800">{formatCurrency(category.amount)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center justify-between gap-3 px-5 py-5 sm:px-6">
                  <div>
                    <h2 className="font-semibold text-slate-900">Recent transactions</h2>
                    <p className="mt-1 text-xs text-slate-500">Your latest account activity</p>
                  </div>
                  <button type="button" className="text-sm font-semibold text-emerald-800 hover:text-emerald-950">
                    View all
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-sm">
                    <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                      <tr>
                        <th scope="col" className="px-4 py-3 font-semibold">Merchant</th>
                        <th scope="col" className="hidden px-4 py-3 font-semibold sm:table-cell">Category</th>
                        <th scope="col" className="px-4 py-3 font-semibold">Date</th>
                        <th scope="col" className="px-4 py-3 text-right font-semibold">Amount</th>
                        <th scope="col" className="hidden px-4 py-3 font-semibold sm:table-cell">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.transactions.map((transaction) => (
                        <TransactionRow key={transaction.id} transaction={transaction} />
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <p className="text-xs text-slate-400">
                Demonstration data · Amounts shown in South African rand (ZAR)
              </p>
            </div>
          ) : null}
        </main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-4 border-t border-slate-200 bg-white px-2 pb-[env(safe-area-inset-bottom)] pt-2 md:hidden" aria-label="Mobile navigation">
        {[
          { label: 'Overview', icon: LayoutDashboard },
          { label: 'Activity', icon: CreditCard },
          { label: 'Insights', icon: Activity },
          { label: 'Settings', icon: Settings },
        ].map(({ label, icon: Icon }, index) => (
          <a
            key={label}
            href={`#${label.toLowerCase()}`}
            aria-current={index === 0 ? 'page' : undefined}
            className={`flex flex-col items-center gap-1 py-2 text-[10px] font-medium ${
              index === 0 ? 'text-emerald-800' : 'text-slate-500'
            }`}
          >
            <Icon size={19} aria-hidden="true" />
            {label}
          </a>
        ))}
      </nav>
    </div>
  )
}

export default App