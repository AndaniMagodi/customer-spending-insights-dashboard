import { Activity, CreditCard, ShoppingBasket, Wallet } from 'lucide-react'
import { KpiCard } from './KpiCard'
import type { SpendingSummary } from '../types'

const currency = (amount: number) => new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(amount)

export function SpendingSummaryCards({ summary }: { summary: SpendingSummary }) {
  return (
    <section aria-label="Spending summary" className="grid grid-cols-2 gap-3 md:grid-cols-2 lg:grid-cols-4">
      <KpiCard title="Total spent" value={currency(summary.totalSpent)} detail="compared with previous period" change={summary.comparedToPrevious.spentChange} icon={Wallet} featured />
      <KpiCard title="Average transaction" value={currency(summary.averageTransaction)} detail={`${summary.transactionCount} transactions`} icon={CreditCard} />
      <KpiCard title="Top category" value={summary.topCategory} detail="highest spending this period" icon={ShoppingBasket} />
      <KpiCard title="Transactions" value={String(summary.transactionCount)} detail={`${summary.comparedToPrevious.transactionChange}% vs previous period`} icon={Activity} />
    </section>
  )
}
