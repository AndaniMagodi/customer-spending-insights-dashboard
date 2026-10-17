import { RotateCw } from 'lucide-react'

interface QuerySectionStateProps {
  label: string
  loading: boolean
  error: Error | null
  onRetry: () => void
}

export function QuerySectionState({ label, loading, error, onRetry }: QuerySectionStateProps) {
  if (loading) {
    return <section aria-label={label} aria-busy="true" className="min-h-40 animate-pulse rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><span role="status" aria-label={`Loading ${label.toLowerCase()}`} className="sr-only">Loading {label.toLowerCase()}</span><div className="h-4 w-36 rounded bg-slate-200" /><div className="mt-5 h-20 rounded-xl bg-slate-100" /></section>
  }

  return (
    <section aria-label={label} role="alert" className="rounded-2xl border border-rose-200 bg-white p-6 shadow-sm">
      <h2 className="font-semibold text-rose-900">{label} unavailable</h2>
      <p className="mt-2 text-sm text-slate-600">{error?.message ?? 'The data could not be loaded.'}</p>
      <button type="button" onClick={onRetry} className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-lg bg-emerald-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-900">
        <RotateCw size={15} aria-hidden="true" /> Try again
      </button>
    </section>
  )
}
