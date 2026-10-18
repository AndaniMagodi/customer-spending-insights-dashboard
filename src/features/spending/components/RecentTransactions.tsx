import { useMemo, useState, type FormEvent } from 'react'
import { ChevronLeft, ChevronRight, Search } from 'lucide-react'
import { formatCompactDate, formatCurrency, formatTransactionDate } from '../../../lib/format'
import { CategoryIcon } from './CategoryIcon'
import type { FiltersResponse, Transaction, TransactionFilters } from '../types'

export const TRANSACTIONS_PAGE_SIZE = 5

interface RecentTransactionsProps {
  transactions: Transaction[]
  pagination?: { total: number; limit: number; offset: number; hasMore: boolean }
  page?: number
  onPageChange?: (page: number) => void
  categories: FiltersResponse['categories']
  filters: TransactionFilters
  onFiltersChange: (filters: TransactionFilters) => void
}

function TransactionRow({ transaction }: { transaction: Transaction }) {
  const [expanded, setExpanded] = useState(false)
  const detailsId = `transaction-details-${transaction.id}`
  return <>
    <tr className="group border-t border-slate-100 transition-colors hover:bg-emerald-50/30">
      <td className="w-[62%] px-4 py-3 font-semibold text-slate-800 sm:w-auto sm:whitespace-nowrap sm:py-4"><button type="button" className="flex max-w-full items-center gap-2 text-left hover:text-emerald-800" aria-expanded={expanded} aria-controls={detailsId} aria-label={`${transaction.merchant} transaction details`} onClick={() => setExpanded((value) => !value)}><span className="grid size-7 shrink-0 place-items-center rounded-lg bg-slate-50"><CategoryIcon name={transaction.icon} color={transaction.categoryColor} size={15} /></span><span className="truncate">{transaction.merchant}</span></button><span className="mt-1 block text-xs font-normal text-slate-500 sm:hidden" title={formatTransactionDate(transaction.date)}>{transaction.category} · {formatCompactDate(transaction.date)}</span></td>
      <td className="hidden whitespace-nowrap px-4 py-4 text-slate-600 sm:table-cell"><span className="inline-flex items-center gap-2"><CategoryIcon name={transaction.icon} color={transaction.categoryColor} size={15} />{transaction.category}</span></td>
      <td className="hidden whitespace-nowrap px-4 py-4 text-slate-600 sm:table-cell">{formatTransactionDate(transaction.date)}</td>
      <td className="w-[38%] whitespace-nowrap px-4 py-3 text-right text-sm font-semibold text-slate-800 sm:w-auto sm:py-4">{formatCurrency(transaction.amount)}</td>
    </tr>
    <tr hidden={!expanded}><td id={detailsId} colSpan={4} className="bg-slate-50 px-4 py-3 text-xs text-slate-600"><span>{transaction.description}</span><span className="mx-2 text-slate-300" aria-hidden="true">·</span><span>{transaction.paymentMethod}</span></td></tr>
  </>
}

export function RecentTransactions({ transactions, pagination, page: controlledPage, onPageChange, categories, filters, onFiltersChange }: RecentTransactionsProps) {
  const [searchInput, setSearchInput] = useState(filters.search ?? '')
  const [localPage, setLocalPage] = useState(0)
  const [draftStartDate, setDraftStartDate] = useState(filters.startDate)
  const [draftEndDate, setDraftEndDate] = useState(filters.endDate)
  const [dateError, setDateError] = useState('')
  const [draftAmountMin, setDraftAmountMin] = useState(filters.amountMin ?? '')
  const [draftAmountMax, setDraftAmountMax] = useState(filters.amountMax ?? '')
  const [amountError, setAmountError] = useState('')

  const isServerPaginated = Boolean(pagination && controlledPage !== undefined && onPageChange)
  const searchText = isServerPaginated ? filters.search ?? '' : searchInput
  const filteredTransactions = useMemo(() => {
    const normalizedSearch = searchText.trim().toLocaleLowerCase()
    return transactions.filter((transaction) => {
      const searchableText = `${transaction.merchant} ${transaction.category} ${transaction.description}`.toLocaleLowerCase()
      return isServerPaginated || !normalizedSearch || searchableText.includes(normalizedSearch)
    })
  }, [isServerPaginated, searchText, transactions])

  const page = controlledPage ?? localPage
  const pageCount = isServerPaginated ? Math.ceil((pagination?.total ?? 0) / TRANSACTIONS_PAGE_SIZE) : Math.ceil(filteredTransactions.length / TRANSACTIONS_PAGE_SIZE)
  const pageTransactions = isServerPaginated ? filteredTransactions : filteredTransactions.slice(page * TRANSACTIONS_PAGE_SIZE, (page + 1) * TRANSACTIONS_PAGE_SIZE)
  const firstResult = filteredTransactions.length === 0 ? 0 : (pagination?.offset ?? page * TRANSACTIONS_PAGE_SIZE) + 1
  const lastResult = firstResult === 0 ? 0 : firstResult + pageTransactions.length - 1

  function changePage(nextPage: number) {
    if (isServerPaginated) onPageChange?.(nextPage)
    else setLocalPage(nextPage)
  }

  function updateFilters(next: TransactionFilters) {
    onFiltersChange(next)
    changePage(0)
  }

  function applyDateRange(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (Boolean(draftStartDate) !== Boolean(draftEndDate)) {
      setDateError('Choose both a start date and an end date, or clear both.')
      return
    }
    if (draftStartDate && draftEndDate && draftStartDate > draftEndDate) {
      setDateError('The start date must be on or before the end date.')
      return
    }
    setDateError('')
    updateFilters({ ...filters, startDate: draftStartDate, endDate: draftEndDate })
  }

  function applyAmountRange(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const minimum = draftAmountMin.trim() ? Number(draftAmountMin) : undefined
    const maximum = draftAmountMax.trim() ? Number(draftAmountMax) : undefined
    if ((minimum !== undefined && (!Number.isFinite(minimum) || minimum < 0)) || (maximum !== undefined && (!Number.isFinite(maximum) || maximum < 0))) {
      setAmountError('Amounts must be zero or greater.')
      return
    }
    if (minimum !== undefined && maximum !== undefined && minimum > maximum) {
      setAmountError('The minimum amount must not exceed the maximum.')
      return
    }
    setAmountError('')
    updateFilters({ ...filters, amountMin: draftAmountMin.trim(), amountMax: draftAmountMax.trim() })
  }

  function clearFilters() {
    setSearchInput('')
    setDraftStartDate('')
    setDraftEndDate('')
    setDraftAmountMin('')
    setDraftAmountMax('')
    setDateError('')
    setAmountError('')
    updateFilters({ category: null, startDate: '', endDate: '', sortBy: 'date_desc', search: '', amountMin: '', amountMax: '' })
  }

  return (
    <section className="dashboard-surface rounded-2xl border bg-white" aria-labelledby="transactions-title">
      <div className="space-y-4 px-5 py-5 sm:px-6">
        <div>
          <h2 id="transactions-title" className="font-semibold text-slate-900">Recent transactions</h2>
          <p className="mt-1 text-xs text-slate-500">Search and category narrow the list. The selected date window updates the summary and category chart as well.</p>
        </div>
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-[minmax(12rem,1fr)_12rem_12rem]">
          <label className="relative col-span-2 block lg:col-span-1">
            <span className="sr-only">Search all transactions</span>
            <Search size={17} aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={searchText}
              onChange={(event) => { setSearchInput(event.target.value); updateFilters({ ...filters, search: event.target.value }) }}
              placeholder="Search all transactions"
              className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15"
            />
          </label>
          <label>
            <span className="sr-only">Filter by transaction category</span>
            <select
              value={filters.category ?? 'all'}
              onChange={(event) => updateFilters({ ...filters, category: event.target.value === 'all' ? null : event.target.value })}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15"
            >
              <option value="all">All categories</option>
              {categories.map((item) => <option key={item.name} value={item.name}>{item.name}</option>)}
            </select>
          </label>
          <label>
            <span className="sr-only">Sort transactions</span>
            <select
              value={filters.sortBy}
              onChange={(event) => updateFilters({ ...filters, sortBy: event.target.value as TransactionFilters['sortBy'] })}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15"
            >
              <option value="date_desc">Newest first</option>
              <option value="date_asc">Oldest first</option>
              <option value="amount_desc">Amount: high to low</option>
              <option value="amount_asc">Amount: low to high</option>
            </select>
          </label>
        </div>
        <form onSubmit={applyDateRange} className="flex flex-col gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3 sm:flex-row sm:items-end">
          <fieldset className="grid min-w-0 flex-1 grid-cols-2 gap-2.5 sm:gap-3">
            <legend className="mb-2 text-xs font-semibold text-slate-600">Dashboard date range</legend>
            <label className="flex min-w-0 flex-col gap-1 text-xs text-slate-600">From
              <input type="date" value={draftStartDate} max={draftEndDate || undefined} onChange={(event) => setDraftStartDate(event.target.value)} className="min-w-0 w-full rounded-lg border border-slate-200 bg-white px-2 py-2 text-sm sm:px-3" />
            </label>
            <label className="flex min-w-0 flex-col gap-1 text-xs text-slate-600">To
              <input type="date" value={draftEndDate} min={draftStartDate || undefined} onChange={(event) => setDraftEndDate(event.target.value)} className="min-w-0 w-full rounded-lg border border-slate-200 bg-white px-2 py-2 text-sm sm:px-3" />
            </label>
          </fieldset>
          <div className="flex gap-2 sm:shrink-0">
            <button type="submit" aria-label="Apply dates" className="flex-1 rounded-lg bg-emerald-800 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-900 sm:flex-none sm:px-4">Apply</button>
            <button type="button" onClick={clearFilters} className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 sm:flex-none sm:px-4">Clear</button>
          </div>
        </form>
        <form onSubmit={applyAmountRange} className="flex flex-col gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3 sm:flex-row sm:items-end">
          <fieldset className="grid min-w-0 flex-1 grid-cols-2 gap-2.5 sm:gap-3">
            <legend className="mb-2 text-xs font-semibold text-slate-600">Amount range</legend>
            <label className="flex min-w-0 flex-col gap-1 text-xs text-slate-600">Minimum
              <input type="number" inputMode="decimal" min="0" step="0.01" value={draftAmountMin} onChange={(event) => setDraftAmountMin(event.target.value)} className="min-w-0 w-full rounded-lg border border-slate-200 bg-white px-2 py-2 text-sm sm:px-3" placeholder="Any" />
            </label>
            <label className="flex min-w-0 flex-col gap-1 text-xs text-slate-600">Maximum
              <input type="number" inputMode="decimal" min="0" step="0.01" value={draftAmountMax} onChange={(event) => setDraftAmountMax(event.target.value)} className="min-w-0 w-full rounded-lg border border-slate-200 bg-white px-2 py-2 text-sm sm:px-3" placeholder="Any" />
            </label>
          </fieldset>
          <button type="submit" className="rounded-lg bg-emerald-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-900">Apply amounts</button>
        </form>
        {amountError && <p role="alert" className="text-xs text-rose-700">{amountError}</p>}
        {(searchText.trim() || filters.category || filters.startDate || filters.endDate || filters.amountMin || filters.amountMax || filters.sortBy !== 'date_desc') && <div className="flex flex-wrap items-center gap-2" aria-label="Active transaction filters">
          {searchText.trim() && <button type="button" onClick={() => { setSearchInput(''); updateFilters({ ...filters, search: '' }) }} className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-950">Search: “{searchText.trim()}” <span aria-hidden="true">×</span><span className="sr-only">Remove search filter</span></button>}
          {filters.category && <button type="button" onClick={() => updateFilters({ ...filters, category: null })} className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-950">Category: {filters.category} <span aria-hidden="true">×</span><span className="sr-only">Remove category filter</span></button>}
          {(filters.startDate || filters.endDate) && <button type="button" onClick={() => { setDraftStartDate(''); setDraftEndDate(''); updateFilters({ ...filters, startDate: '', endDate: '' }) }} className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-950">Dates: {filters.startDate ? formatCompactDate(`${filters.startDate}T12:00:00`) : 'Any'} – {filters.endDate ? formatCompactDate(`${filters.endDate}T12:00:00`) : 'Any'} <span aria-hidden="true">×</span><span className="sr-only">Remove date filter</span></button>}
          {(filters.amountMin || filters.amountMax) && <button type="button" onClick={() => { setDraftAmountMin(''); setDraftAmountMax(''); updateFilters({ ...filters, amountMin: '', amountMax: '' }) }} className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-950">Amount: {filters.amountMin ? formatCurrency(Number(filters.amountMin)) : 'Any'} – {filters.amountMax ? formatCurrency(Number(filters.amountMax)) : 'Any'} <span aria-hidden="true">×</span><span className="sr-only">Remove amount filter</span></button>}
          {filters.sortBy !== 'date_desc' && <button type="button" onClick={() => updateFilters({ ...filters, sortBy: 'date_desc' })} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700">Sort: {filters.sortBy.replace('_', ' ')} <span aria-hidden="true">×</span><span className="sr-only">Reset sort order</span></button>}
          <button type="button" onClick={clearFilters} className="px-2 py-1 text-xs font-semibold text-slate-500 underline decoration-slate-300 underline-offset-4 hover:text-slate-900">Clear all</button>
        </div>}
        {dateError && <p role="alert" className="text-xs text-rose-700">{dateError}</p>}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr><th scope="col" className="bg-gradient-to-r from-slate-50 to-emerald-50/50 px-4 py-3 font-semibold">Merchant</th><th scope="col" className="hidden bg-gradient-to-r from-slate-50 to-emerald-50/50 px-4 py-3 font-semibold sm:table-cell">Category</th><th scope="col" className="hidden bg-gradient-to-r from-slate-50 to-emerald-50/50 px-4 py-3 font-semibold sm:table-cell">Date</th><th scope="col" className="bg-gradient-to-r from-slate-50 to-emerald-50/50 px-4 py-3 text-right font-semibold">Amount</th></tr>
          </thead>
          <tbody>
            {pageTransactions.map((transaction) => <TransactionRow key={transaction.id} transaction={transaction} />)}
            {pageTransactions.length === 0 && <tr><td colSpan={4} className="px-4 py-10 text-center text-sm text-slate-500">No transactions match these filters.</td></tr>}
          </tbody>
        </table>
      </div>
      <footer className="flex flex-col gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="text-xs text-slate-500" aria-live="polite">
          {filteredTransactions.length === 0 ? 'No matching transactions' : isServerPaginated ? `Showing ${firstResult}–${lastResult} of ${pagination?.total ?? 0} transactions` : `Showing ${firstResult}–${lastResult} of ${filteredTransactions.length} loaded transactions`}
        </p>
        <nav aria-label="Transaction pages" className="flex items-center gap-2">
          <button type="button" onClick={() => changePage(Math.max(0, page - 1))} disabled={page === 0} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40">
            <ChevronLeft size={15} aria-hidden="true" /> Previous
          </button>
          <span className="min-w-16 text-center text-xs text-slate-500">{pageCount === 0 ? '0 / 0' : `${page + 1} / ${pageCount}`}</span>
          <button type="button" onClick={() => changePage(Math.min(pageCount - 1, page + 1))} disabled={isServerPaginated ? !pagination?.hasMore : page >= pageCount - 1} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40">
            Next <ChevronRight size={15} aria-hidden="true" />
          </button>
        </nav>
      </footer>
    </section>
  )
}
