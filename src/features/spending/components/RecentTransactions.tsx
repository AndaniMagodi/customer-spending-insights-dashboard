import { useState } from 'react'
import type { Transaction } from '../types'

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
  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between gap-3 px-5 py-5 sm:px-6"><div><h2 className="font-semibold text-slate-900">Recent transactions</h2><p className="mt-1 text-xs text-slate-500">Your latest account activity</p></div></div>
      <div className="overflow-x-auto"><table className="w-full border-collapse text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th scope="col" className="px-4 py-3 font-semibold">Merchant</th><th scope="col" className="hidden px-4 py-3 font-semibold sm:table-cell">Category</th><th scope="col" className="px-4 py-3 font-semibold">Date</th><th scope="col" className="px-4 py-3 text-right font-semibold">Amount</th></tr></thead><tbody>{transactions.map((transaction) => <TransactionRow key={transaction.id} transaction={transaction} />)}</tbody></table></div>
    </section>
  )
}
