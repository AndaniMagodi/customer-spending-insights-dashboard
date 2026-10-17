import { useState } from 'react'
import { lazy, Suspense } from 'react'
import { useQuery } from '@tanstack/react-query'
import { DashboardPageHeader } from '../components/DashboardPageHeader'
import { DashboardShell } from '../components/DashboardShell'
import { DashboardSkeleton } from '../components/DashboardSkeleton'
import { RecentTransactions } from '../components/RecentTransactions'
import { SpendingSummaryCards } from '../components/SpendingSummaryCards'
import { getCustomerProfile, getRecentTransactions, getSpendingCategories, getSpendingSummary, getSpendingTrends } from '../api/spendingApi'
import type { SpendingPeriod, TransactionFilters } from '../types'

const CategoryBreakdown = lazy(() => import('../components/CategoryBreakdown').then((module) => ({ default: module.CategoryBreakdown })))
const SpendingTrendChart = lazy(() => import('../components/SpendingTrendChart').then((module) => ({ default: module.SpendingTrendChart })))

const initialTransactionFilters: TransactionFilters = {
  category: null,
  startDate: '',
  endDate: '',
  sortBy: 'date_desc',
}

export function SpendingDashboardPage() {
  const [period, setPeriod] = useState<SpendingPeriod>('30d')
  const [transactionFilters, setTransactionFilters] = useState(initialTransactionFilters)
  // Trends are monthly in the supplied API, so short date ranges still need
  // at least two points to render a useful line chart.
  const trendMonths = period === '90d' ? 3 : period === '1y' ? 12 : 2
  const profile = useQuery({ queryKey: ['customer-profile'], queryFn: getCustomerProfile })
  const summary = useQuery({ queryKey: ['spending-summary', period], queryFn: () => getSpendingSummary(period) })
  const categories = useQuery({ queryKey: ['spending-categories', period], queryFn: () => getSpendingCategories(period) })
  const trends = useQuery({ queryKey: ['spending-trends', trendMonths], queryFn: () => getSpendingTrends(trendMonths) })
  // Text search is local because it is not part of the supplied endpoint.
  // Category, date range, and sort use the endpoint's supported query fields.
  const transactions = useQuery({
    queryKey: ['spending-transactions', period, transactionFilters],
    queryFn: () => getRecentTransactions(period, { ...transactionFilters, limit: 100, offset: 0 }),
  })

  const isPending = profile.isPending || summary.isPending || categories.isPending || trends.isPending || transactions.isPending
  const error = profile.error || summary.error || categories.error || trends.error || transactions.error
  const retry = () => {
    void Promise.all([profile.refetch(), summary.refetch(), categories.refetch(), trends.refetch(), transactions.refetch()])
  }
  const changePeriod = (nextPeriod: SpendingPeriod) => {
    setPeriod(nextPeriod)
    setTransactionFilters(initialTransactionFilters)
  }

  return (
    <DashboardShell customerName={profile.data?.name ?? 'Customer'}>
      <main id="overview" aria-busy={isPending} className="mx-auto max-w-7xl px-4 pb-28 pt-7 sm:px-7 sm:pt-9 md:pb-10">
        <DashboardPageHeader period={period} onPeriodChange={changePeriod} />

        {isPending ? <DashboardSkeleton /> : error ? (
          <section role="alert" className="rounded-2xl border border-rose-200 bg-white p-6">
            <h2 className="font-semibold text-rose-900">Spending data is unavailable</h2>
            <p className="mt-2 text-sm text-slate-600">{error.message}</p>
            <button type="button" onClick={retry} className="mt-4 rounded-lg bg-emerald-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-900">Try again</button>
          </section>
        ) : summary.data && categories.data && trends.data && transactions.data ? (
          <div className="space-y-5">
            <SpendingSummaryCards summary={summary.data} />
            <section id="insights" className="grid gap-5 xl:grid-cols-[1.55fr_1fr]">
              <Suspense fallback={<div aria-hidden="true" className="h-80 animate-pulse rounded-2xl bg-slate-200" />}>
                <SpendingTrendChart trends={trends.data.trends} />
              </Suspense>
              <Suspense fallback={<div aria-hidden="true" className="h-80 animate-pulse rounded-2xl bg-slate-200" />}>
                <CategoryBreakdown categories={categories.data.categories} />
              </Suspense>
            </section>
            <section id="transactions">
              <RecentTransactions
                key={period}
                transactions={transactions.data.transactions}
                categories={categories.data.categories.map((category) => category.name)}
                filters={transactionFilters}
                onFiltersChange={setTransactionFilters}
              />
            </section>
            <p className="text-xs text-slate-400">Demonstration data · Amounts shown in South African rand (ZAR)</p>
          </div>
        ) : null}
      </main>
    </DashboardShell>
  )
}
