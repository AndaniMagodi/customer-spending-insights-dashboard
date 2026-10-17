import { lazy, Suspense, useState } from 'react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { DashboardPageHeader } from '../components/DashboardPageHeader'
import { DashboardShell } from '../components/DashboardShell'
import { QuerySectionState } from '../components/QuerySectionState'
import { RecentTransactions, TRANSACTIONS_PAGE_SIZE } from '../components/RecentTransactions'
import { SpendingSummaryCards } from '../components/SpendingSummaryCards'
import { SpendingGoals } from '../components/SpendingGoals'
import { getCustomerProfile, getRecentTransactions, getSpendingCategories, getSpendingFilters, getSpendingGoals, getSpendingSummary, getSpendingTrends } from '../api/spendingApi'
import type { SpendingPeriod, TransactionFilters } from '../types'

const CategoryBreakdown = lazy(() => import('../components/CategoryBreakdown').then((module) => ({ default: module.CategoryBreakdown })))
const SpendingTrendChart = lazy(() => import('../components/SpendingTrendChart').then((module) => ({ default: module.SpendingTrendChart })))

const initialTransactionFilters: TransactionFilters = {
  category: null,
  startDate: '',
  endDate: '',
  sortBy: 'date_desc',
}
const fallbackPeriodPresets = [
  { label: 'Last 7 days', value: '7d' as const },
  { label: 'Last 30 days', value: '30d' as const },
  { label: 'Last 90 days', value: '90d' as const },
  { label: 'Last year', value: '1y' as const },
]

export function SpendingDashboardPage() {
  const [period, setPeriod] = useState<SpendingPeriod>('30d')
  const [transactionFilters, setTransactionFilters] = useState(initialTransactionFilters)
  const [transactionPage, setTransactionPage] = useState(0)
  const trendMonths = period === '1y' ? 12 : 6
  const profile = useQuery({ queryKey: ['customer-profile'], queryFn: ({ signal }) => getCustomerProfile(signal) })
  const filters = useQuery({ queryKey: ['spending-filters'], queryFn: ({ signal }) => getSpendingFilters(signal) })
  const goals = useQuery({ queryKey: ['spending-goals'], queryFn: ({ signal }) => getSpendingGoals(signal) })
  const summary = useQuery({ queryKey: ['spending-summary', period], queryFn: ({ signal }) => getSpendingSummary(period, signal), placeholderData: keepPreviousData })
  const categories = useQuery({
    queryKey: ['spending-categories', period, transactionFilters.startDate, transactionFilters.endDate],
    queryFn: ({ signal }) => getSpendingCategories(period, { startDate: transactionFilters.startDate || undefined, endDate: transactionFilters.endDate || undefined }, signal),
    placeholderData: keepPreviousData,
  })
  const trends = useQuery({ queryKey: ['spending-trends', trendMonths], queryFn: ({ signal }) => getSpendingTrends(trendMonths, signal), placeholderData: keepPreviousData })
  const transactions = useQuery({
    queryKey: ['spending-transactions', period, transactionFilters, transactionPage],
    queryFn: ({ signal }) => getRecentTransactions(period, {
      ...transactionFilters,
      limit: TRANSACTIONS_PAGE_SIZE,
      offset: transactionPage * TRANSACTIONS_PAGE_SIZE,
    }, signal),
    placeholderData: keepPreviousData,
  })

  const changePeriod = (nextPeriod: SpendingPeriod) => {
    setPeriod(nextPeriod)
    setTransactionFilters(initialTransactionFilters)
    setTransactionPage(0)
  }
  const changeTransactionFilters = (filters: TransactionFilters) => {
    setTransactionFilters(filters)
    setTransactionPage(0)
  }
  const initialLoading = [profile, summary, categories, trends, transactions].some((query) => query.isLoading)

  return (
    <DashboardShell customerName={profile.data?.name ?? 'Customer'}>
      <main id="overview" aria-busy={initialLoading} className="mx-auto max-w-7xl scroll-mt-20 px-4 pb-32 pt-7 sm:px-7 sm:pt-9 md:scroll-mt-0 md:pb-10">
        <DashboardPageHeader period={period} onPeriodChange={changePeriod} presets={filters.data?.dateRangePresets ?? fallbackPeriodPresets} />
        <div className="dashboard-enter mt-5 space-y-5">
          {summary.data ? (
            <>
              {summary.isError && <QuerySectionState label="Spending summary" loading={false} error={summary.error} onRetry={() => void summary.refetch()} />}
              <SpendingSummaryCards summary={summary.data} categories={transactionFilters.startDate ? [] : categories.data?.categories ?? []} trends={trends.data?.trends ?? []} />
            </>
          ) : <QuerySectionState label="Spending summary" loading={summary.isLoading} error={summary.error} onRetry={() => void summary.refetch()} />}

          {goals.data ? <>
            {goals.isError && <QuerySectionState label="Spending goals" loading={false} error={goals.error} onRetry={() => void goals.refetch()} />}
            <SpendingGoals goals={goals.data.goals} />
          </> : <QuerySectionState label="Spending goals" loading={goals.isLoading} error={goals.error} onRetry={() => void goals.refetch()} />}

          <section id="insights" className="grid scroll-mt-20 gap-5 xl:grid-cols-[1.55fr_1fr] md:scroll-mt-0" aria-label="Spending insights">
            <div className="space-y-3">
              {trends.data ? <>
                {trends.isError && <QuerySectionState label="Spending trends" loading={false} error={trends.error} onRetry={() => void trends.refetch()} />}
                <Suspense fallback={<div aria-hidden="true" className="h-80 animate-pulse rounded-2xl bg-slate-200" />}><SpendingTrendChart trends={trends.data.trends} /></Suspense>
              </> : <QuerySectionState label="Spending trends" loading={trends.isLoading} error={trends.error} onRetry={() => void trends.refetch()} />}
            </div>
            <div className="space-y-3">
              {categories.data ? <>
                {categories.isError && <QuerySectionState label="Category breakdown" loading={false} error={categories.error} onRetry={() => void categories.refetch()} />}
                <Suspense fallback={<div aria-hidden="true" className="h-80 animate-pulse rounded-2xl bg-slate-200" />}><CategoryBreakdown categories={categories.data.categories} /></Suspense>
              </> : <QuerySectionState label="Category breakdown" loading={categories.isLoading} error={categories.error} onRetry={() => void categories.refetch()} />}
            </div>
          </section>

          <section id="transactions" className="scroll-mt-20 space-y-3 md:scroll-mt-0">
            {transactions.isFetching && transactions.data && <p role="status" className="text-xs text-slate-500">Updating transactions…</p>}
            {transactions.isError && transactions.data && <QuerySectionState label="Transactions" loading={false} error={transactions.error} onRetry={() => void transactions.refetch()} />}
            {transactions.data ? (
              <RecentTransactions
                key={period}
                transactions={transactions.data.transactions}
                pagination={transactions.data.pagination}
                page={transactionPage}
                onPageChange={setTransactionPage}
                categories={filters.data?.categories ?? []}
                filters={transactionFilters}
                onFiltersChange={changeTransactionFilters}
              />
            ) : <QuerySectionState label="Transactions" loading={transactions.isLoading} error={transactions.error} onRetry={() => void transactions.refetch()} />}
          </section>

          {profile.isError && <p role="alert" className="flex flex-wrap items-center gap-2 text-xs text-amber-800">Customer profile could not be loaded. Spending data is still available.<button type="button" onClick={() => void profile.refetch()} className="font-semibold underline underline-offset-2">Retry profile</button></p>}
          {filters.isError && <p role="alert" className="flex flex-wrap items-center gap-2 text-xs text-amber-800">Category filters could not be loaded.<button type="button" onClick={() => void filters.refetch()} className="font-semibold underline underline-offset-2">Retry filters</button></p>}
          <p className="text-xs text-slate-400">Demonstration data · Amounts shown in South African rand (ZAR)</p>
        </div>
      </main>
    </DashboardShell>
  )
}
