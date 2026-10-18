import { Activity, ArrowDownRight, ArrowUpRight, CreditCard, ShoppingBasket, Wallet } from 'lucide-react'
import { formatCurrency, formatMonth } from '../../../lib/format'
import { KpiCard } from './KpiCard'
import type { SpendingCategory, SpendingSummary, SpendingTrend } from '../types'

const periodDays: Record<SpendingSummary['period'], number> = { '7d': 7, '30d': 30, '90d': 90, '1y': 365 }

function biggestMonthlyMovement(trends: SpendingTrend[]) {
  let biggest: { month: string; amount: number; increased: boolean } | undefined
  for (let index = 1; index < trends.length; index += 1) {
    const amount = trends[index].totalSpent - trends[index - 1].totalSpent
    if (!biggest || Math.abs(amount) > Math.abs(biggest.amount)) biggest = { month: trends[index].month, amount, increased: amount > 0 }
  }
  return biggest
}

export function SpendingSummaryCards({ summary, categories = [], trends = [], daysInRange }: { summary: SpendingSummary; categories?: SpendingCategory[]; trends?: SpendingTrend[]; daysInRange?: number }) {
  const topCategory = categories.find((category) => category.name === summary.topCategory)
  const movement = biggestMonthlyMovement(trends)

  return (
    <section aria-label="Spending summary" className="space-y-3">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard title="Total spent" value={formatCurrency(summary.totalSpent)} detail="compared with previous period" change={summary.comparedToPrevious.spentChange} icon={Wallet} featured />
        <KpiCard title="Average transaction" value={formatCurrency(summary.averageTransaction)} detail={`${summary.transactionCount} transactions`} icon={CreditCard} />
        <KpiCard title="Top category" value={summary.topCategory} detail={topCategory ? `${formatCurrency(topCategory.amount)} · ${topCategory.percentage}% of spend` : 'highest spending this period'} icon={ShoppingBasket} />
        <KpiCard title="Transactions" value={String(summary.transactionCount)} detail="vs previous period" change={summary.comparedToPrevious.transactionChange} icon={Activity} />
      </div>

      <div aria-label="Additional spending insights" className="grid gap-3 sm:grid-cols-2">
        <article className="rounded-xl border border-emerald-100 bg-emerald-50/70 px-4 py-3">
          <p className="text-xs font-medium text-emerald-900/70">Average daily spend</p>
          <p className="mt-1 text-sm font-semibold tabular-nums text-emerald-950">{formatCurrency(summary.totalSpent / (daysInRange ?? periodDays[summary.period]))}</p>
        </article>
        <article className="rounded-xl border border-slate-200 bg-white px-4 py-3">
          <p className="text-xs font-medium text-slate-500">Biggest monthly movement</p>
          <p className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold tabular-nums text-slate-800">
            {movement ? <>{movement.increased ? <ArrowUpRight size={15} className="text-amber-700" aria-label="increased" /> : <ArrowDownRight size={15} className="text-emerald-700" aria-label="decreased" />}{formatCurrency(Math.abs(movement.amount))} in {formatMonth(movement.month)}</> : 'More history needed'}
          </p>
        </article>
      </div>
    </section>
  )
}
