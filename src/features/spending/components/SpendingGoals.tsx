import { AlertTriangle, CheckCircle2, Target } from 'lucide-react'
import { formatCurrency } from '../../../lib/format'
import type { SpendingGoal } from '../types'

export function SpendingGoals({ goals }: { goals: SpendingGoal[] }) {
  return (
    <section aria-labelledby="goals-title" className="dashboard-surface rounded-2xl border bg-white p-5 sm:p-6">
      <div className="mb-4 flex items-start gap-3">
        <span className="rounded-xl bg-emerald-50 p-2 text-emerald-800"><Target size={18} aria-hidden="true" /></span>
        <div><h2 id="goals-title" className="font-semibold text-slate-900">Monthly spending goals</h2><p className="mt-1 text-xs text-slate-500">Track category spending against your monthly budgets.</p></div>
      </div>
      {goals.length === 0 ? <p className="py-6 text-sm text-slate-500">No spending goals have been set.</p> : <ul className="grid gap-3 sm:grid-cols-2">{goals.map((goal) => {
        const warning = goal.status === 'warning'
        const progress = Math.min(goal.percentageUsed, 100)
        return <li key={goal.id} className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
          <div className="flex items-start justify-between gap-3">
            <div><p className="text-sm font-semibold text-slate-800">{goal.category}</p><p className="mt-1 text-xs text-slate-500">{formatCurrency(goal.currentSpent)} of {formatCurrency(goal.monthlyBudget)}</p></div>
            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-semibold ${warning ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-900'}`}>
              {warning ? <AlertTriangle size={13} aria-hidden="true" /> : <CheckCircle2 size={13} aria-hidden="true" />}{warning ? 'Approaching limit' : 'On track'}
            </span>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <div role="progressbar" aria-label={`${goal.category} monthly budget used`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(goal.percentageUsed)} className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200"><div className={`h-full rounded-full ${warning ? 'bg-amber-500' : 'bg-emerald-700'}`} style={{ width: `${progress}%` }} /></div>
            <span className="w-12 text-right text-xs font-semibold tabular-nums text-slate-700">{goal.percentageUsed.toFixed(1)}%</span>
          </div>
          <p className="mt-2 text-[11px] text-slate-500">{goal.daysRemaining} days remaining in this goal period</p>
        </li>
      })}</ul>}
    </section>
  )
}
