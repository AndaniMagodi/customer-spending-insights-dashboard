import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { CategoryBreakdown } from '../components/CategoryBreakdown'
import { DashboardPageHeader } from '../components/DashboardPageHeader'
import { DashboardShell } from '../components/DashboardShell'
import { DashboardSkeleton } from '../components/DashboardSkeleton'
import { RecentTransactions } from '../components/RecentTransactions'
import { SpendingSummaryCards } from '../components/SpendingSummaryCards'
import { SpendingTrendChart } from '../components/SpendingTrendChart'
import { getCustomerProfile, getRecentTransactions, getSpendingCategories, getSpendingSummary, getSpendingTrends } from '../api/spendingApi'
import type { SpendingPeriod } from '../types'

export function SpendingDashboardPage() {
  const [period, setPeriod] = useState<SpendingPeriod>('30d')
  // Trends are monthly in the supplied API, so short date ranges still need
  // at least two points to render a useful line chart.
  const trendMonths = period === '90d' ? 3 : period === '1y' ? 12 : 2
  const profile = useQuery({ queryKey: ['customer-profile'], queryFn: getCustomerProfile })
  const summary = useQuery({ queryKey: ['spending-summary', period], queryFn: () => getSpendingSummary(period) })
  const categories = useQuery({ queryKey: ['spending-categories', period], queryFn: () => getSpendingCategories(period) })
  const trends = useQuery({ queryKey: ['spending-trends', trendMonths], queryFn: () => getSpendingTrends(trendMonths) })
  const transactions = useQuery({ queryKey: ['spending-transactions', period], queryFn: () => getRecentTransactions(period, 10) })

  const isPending = profile.isPending || summary.isPending || categories.isPending || trends.isPending || transactions.isPending
  const error = profile.error || summary.error || categories.error || trends.error || transactions.error

  return (
    <DashboardShell customerName={profile.data?.name ?? 'Customer'}>
      <main id="overview" className="mx-auto max-w-7xl px-4 pb-28 pt-7 sm:px-7 sm:pt-9 md:pb-10">
        <DashboardPageHeader period={period} onPeriodChange={setPeriod} />

        {isPending ? <DashboardSkeleton /> : error ? (
          <section role="alert" className="rounded-2xl border border-rose-200 bg-white p-6">
            <h2 className="font-semibold text-rose-900">Spending data is unavailable</h2>
            <p className="mt-2 text-sm text-slate-600">{error.message}</p>
          </section>
        ) : summary.data && categories.data && trends.data && transactions.data ? (
          <div className="space-y-5">
            <SpendingSummaryCards summary={summary.data} />
            <section id="insights" className="grid gap-5 xl:grid-cols-[1.55fr_1fr]">
              <SpendingTrendChart trends={trends.data.trends} />
              <CategoryBreakdown categories={categories.data.categories} />
            </section>
            <section id="transactions"><RecentTransactions transactions={transactions.data.transactions} /></section>
            <p className="text-xs text-slate-400">Demonstration data · Amounts shown in South African rand (ZAR)</p>
          </div>
        ) : null}
      </main>
    </DashboardShell>
  )
}
