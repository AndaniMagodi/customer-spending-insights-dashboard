import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, Search } from 'lucide-react'
import type { Transaction } from '../types'

const PAGE_SIZE = 5
const currency = (value: number) => new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(value)
const date = (value: string) => new Intl.DateTimeFormat('en-ZA', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value))

function TransactionRow({ transaction }: { transaction: Transaction }) {
  const [expanded, setExpanded] = useState(false)
  return <>
    <tr className="border-t border-slate-100">
      <td className="whitespace-nowrap px-4 py-4 font-semibold text-slate-800"><button type="button" className="text-left hover:text-emerald-800" aria-expanded={expanded} onClick={() => setExpanded((value) => !value)}>{transaction.merchant}</button></td>
      <td className="hidden whitespace-nowrap px-4 py-4 text-slate-600 sm:table-cell">{transaction.category}</td>
      <td className="whitespace-nowrap px-4 py-4 text-slate-600">{date(transaction.date)}</td>
      <td className="whitespace-nowrap px-4 py-4 text-right font-semibold text-slate-800">{currency(transaction.amount)}</td>
    </tr>
    {expanded && <tr className="sm:hidden"><td colSpan={4} className="bg-slate-50 px-4 py-3 text-xs text-slate-600">{transaction.description} · {transaction.paymentMethod}</td></tr>}
  </>
}

export function RecentTransactions({ transactions }: { transactions: Transaction[] }) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [page, setPage] = useState(0)

  const categories = useMemo(
    () => [...new Set(transactions.map((transaction) => transaction.category))].sort((a, b) => a.localeCompare(b)),
    [transactions],
  )
  const filteredTransactions = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase()
    return transactions.filter((transaction) => {
      const matchesCategory = category === 'all' || transaction.category === category
      const searchableText = `${transaction.merchant} ${transaction.category} ${transaction.description}`.toLocaleLowerCase()
      return matchesCategory && (!normalizedSearch || searchableText.includes(normalizedSearch))
    })
  }, [category, search, transactions])

  const pageCount = Math.ceil(filteredTransactions.length / PAGE_SIZE)
  const pageTransactions = filteredTransactions.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)
  const firstResult = filteredTransactions.length === 0 ? 0 : page * PAGE_SIZE + 1
  const lastResult = Math.min((page + 1) * PAGE_SIZE, filteredTransactions.length)

  function updateSearch(value: string) {
    setSearch(value)
    setPage(0)
  }

  function updateCategory(value: string) {
    setCategory(value)
    setPage(0)
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm" aria-labelledby="transactions-title">
      <div className="flex flex-col gap-4 px-5 py-5 sm:px-6">
        <div>
          <h2 id="transactions-title" className="font-semibold text-slate-900">Recent transactions</h2>
          <p className="mt-1 text-xs text-slate-500">Search and filter the transactions currently loaded for this period.</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="relative block flex-1">
            <span className="sr-only">Search loaded transactions</span>
            <Search size={17} aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={search}
              onChange={(event) => updateSearch(event.target.value)}
              placeholder="Search merchant or description"
              className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15"
            />
          </label>
          <label className="sm:w-52">
            <span className="sr-only">Filter by transaction category</span>
            <select
              value={category}
              onChange={(event) => updateCategory(event.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15"
            >
              <option value="all">All categories</option>
              {categories.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr><th scope="col" className="px-4 py-3 font-semibold">Merchant</th><th scope="col" className="hidden px-4 py-3 font-semibold sm:table-cell">Category</th><th scope="col" className="px-4 py-3 font-semibold">Date</th><th scope="col" className="px-4 py-3 text-right font-semibold">Amount</th></tr>
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
