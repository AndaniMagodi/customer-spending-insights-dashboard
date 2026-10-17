import { useMemo, useState, type FormEvent } from 'react'
import { ChevronLeft, ChevronRight, Search } from 'lucide-react'
import type { Transaction, TransactionFilters } from '../types'

const PAGE_SIZE = 5
const currency = (value: number) => new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(value)
const date = (value: string) => new Intl.DateTimeFormat('en-ZA', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value))
const compactDate = (value: string) => new Intl.DateTimeFormat('en-ZA', { day: '2-digit', month: 'short' }).format(new Date(value))

interface RecentTransactionsProps {
  transactions: Transaction[]
  categories: string[]
  filters: TransactionFilters
  onFiltersChange: (filters: TransactionFilters) => void
}

function TransactionRow({ transaction }: { transaction: Transaction }) {
  const [expanded, setExpanded] = useState(false)
  return <>
    <tr className="group border-t border-slate-100 transition-colors hover:bg-emerald-50/30">
      <td className="w-[62%] px-4 py-3 font-semibold text-slate-800 sm:w-auto sm:whitespace-nowrap sm:py-4"><button type="button" className="block max-w-full text-left hover:text-emerald-800" aria-expanded={expanded} onClick={() => setExpanded((value) => !value)}>{transaction.merchant}</button><span className="mt-1 block text-xs font-normal text-slate-500 sm:hidden" title={date(transaction.date)}>{transaction.category} · {compactDate(transaction.date)}</span></td>
      <td className="hidden whitespace-nowrap px-4 py-4 text-slate-600 sm:table-cell">{transaction.category}</td>
      <td className="hidden whitespace-nowrap px-4 py-4 text-slate-600 sm:table-cell">{date(transaction.date)}</td>
      <td className="w-[38%] whitespace-nowrap px-4 py-3 text-right text-sm font-semibold text-slate-800 sm:w-auto sm:py-4">{currency(transaction.amount)}</td>
    </tr>
    {expanded && <tr className="sm:hidden"><td colSpan={4} className="bg-slate-50 px-4 py-3 text-xs text-slate-600">{transaction.description} · {transaction.paymentMethod}</td></tr>}
  </>
}

export function RecentTransactions({ transactions, categories, filters, onFiltersChange }: RecentTransactionsProps) {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const [draftStartDate, setDraftStartDate] = useState(filters.startDate)
  const [draftEndDate, setDraftEndDate] = useState(filters.endDate)
  const [dateError, setDateError] = useState('')

  const filteredTransactions = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase()
    return transactions.filter((transaction) => {
      const searchableText = `${transaction.merchant} ${transaction.category} ${transaction.description}`.toLocaleLowerCase()
      return !normalizedSearch || searchableText.includes(normalizedSearch)
    })
  }, [search, transactions])

  const pageCount = Math.ceil(filteredTransactions.length / PAGE_SIZE)
  const pageTransactions = filteredTransactions.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)
  const firstResult = filteredTransactions.length === 0 ? 0 : page * PAGE_SIZE + 1
  const lastResult = Math.min((page + 1) * PAGE_SIZE, filteredTransactions.length)

  function updateFilters(next: TransactionFilters) {
    onFiltersChange(next)
    setPage(0)
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

  function clearFilters() {
    setSearch('')
    setDraftStartDate('')
    setDraftEndDate('')
    setDateError('')
    updateFilters({ category: null, startDate: '', endDate: '', sortBy: 'date_desc' })
  }

  return (
    <section className="dashboard-surface rounded-2xl border bg-white" aria-labelledby="transactions-title">
      <div className="space-y-4 px-5 py-5 sm:px-6">
        <div>
          <h2 id="transactions-title" className="font-semibold text-slate-900">Recent transactions</h2>
          <p className="mt-1 text-xs text-slate-500">Filters apply to this list. Text search checks the loaded rows; dashboard summaries use the selected spending period.</p>
        </div>
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-[minmax(12rem,1fr)_12rem_12rem]">
          <label className="relative col-span-2 block lg:col-span-1">
            <span className="sr-only">Search loaded transactions</span>
            <Search size={17} aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={search}
              onChange={(event) => { setSearch(event.target.value); setPage(0) }}
              placeholder="Search merchant or description"
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
              {categories.map((item) => <option key={item} value={item}>{item}</option>)}
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
            <legend className="mb-2 text-xs font-semibold text-slate-600">Custom date range</legend>
            <label className="flex min-w-0 flex-col gap-1 text-xs text-slate-600">From
              <input type="date" value={draftStartDate} max={draftEndDate || undefined} onChange={(event) => setDraftStartDate(event.target.value)} className="min-w-0 w-full rounded-lg border border-slate-200 bg-white px-2 py-2 text-sm sm:px-3" />
            </label>
            <label className="flex min-w-0 flex-col gap-1 text-xs text-slate-600">To
              <input type="date" value={draftEndDate} min={draftStartDate || undefined} onChange={(event) => setDraftEndDate(event.target.value)} className="min-w-0 w-full rounded-lg border border-slate-200 bg-white px-2 py-2 text-sm sm:px-3" />
            </label>
          </fieldset>
          <div className="flex gap-2 sm:shrink-0">
            <button type="submit" className="flex-1 rounded-lg bg-emerald-800 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-900 sm:flex-none sm:px-4">Apply</button>
            <button type="button" onClick={clearFilters} className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 sm:flex-none sm:px-4">Clear</button>
          </div>
        </form>
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
          {filteredTransactions.length === 0 ? 'No matching transactions' : `Showing ${firstResult}–${lastResult} of ${filteredTransactions.length} loaded transactions`}
        </p>
        <nav aria-label="Transaction pages" className="flex items-center gap-2">
          <button type="button" onClick={() => setPage((current) => Math.max(0, current - 1))} disabled={page === 0} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40">
            <ChevronLeft size={15} aria-hidden="true" /> Previous
          </button>
          <span className="min-w-16 text-center text-xs text-slate-500">{pageCount === 0 ? '0 / 0' : `${page + 1} / ${pageCount}`}</span>
          <button type="button" onClick={() => setPage((current) => Math.min(pageCount - 1, current + 1))} disabled={page >= pageCount - 1} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40">
            Next <ChevronRight size={15} aria-hidden="true" />
          </button>
        </nav>
      </footer>
    </section>
  )
}
