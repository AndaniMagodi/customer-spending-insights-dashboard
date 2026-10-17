import { useEffect, useState, type ReactNode } from 'react'
import { Activity, CreditCard, LayoutDashboard } from 'lucide-react'

const links = [
  { label: 'Overview', icon: LayoutDashboard, href: '#overview' },
  { label: 'Transactions', icon: CreditCard, href: '#transactions' },
  { label: 'Insights', icon: Activity, href: '#insights' },
]

export function DashboardShell({ children, customerName }: { children: ReactNode; customerName: string }) {
  const [activeHref, setActiveHref] = useState(() => window.location.hash || '#overview')
  const initials = customerName.split(/\s+/).map((part) => part[0]).slice(0, 2).join('').toUpperCase()

  useEffect(() => {
    const updateActiveLink = () => setActiveHref(window.location.hash || '#overview')
    window.addEventListener('hashchange', updateActiveLink)
    return () => window.removeEventListener('hashchange', updateActiveLink)
  }, [])

  const navigation = (label: string, compact = false) => (
    <nav aria-label={label} className={compact ? 'grid grid-cols-3 gap-1' : 'space-y-1'}>
      {links.map(({ label: linkLabel, icon: Icon, href }) => (
        <a
          key={linkLabel}
          href={href}
          aria-current={activeHref === href ? 'location' : undefined}
          className={`flex rounded-xl text-sm font-medium transition-all duration-200 ${compact ? 'min-h-12 flex-col items-center justify-center gap-1 py-1 text-[10px]' : 'items-center gap-3 px-3 py-3'} ${activeHref === href ? 'bg-emerald-50 text-emerald-900 shadow-sm ring-1 ring-emerald-100' : 'text-slate-500 hover:translate-x-0.5 hover:bg-slate-50 hover:text-slate-900'}`}
        >
          <Icon size={18} aria-hidden="true" />{linkLabel}
        </a>
      ))}
    </nav>
  )

  return (
    <div className="dashboard-background min-h-screen text-slate-900">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-60 flex-col border-r border-slate-200 bg-white px-4 py-6 md:flex">
        <a href="#overview" className="mb-10 flex items-center gap-3 px-2">
          <span className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-emerald-700 to-emerald-950 text-lg font-bold text-white shadow-md shadow-emerald-950/15" aria-hidden="true">S</span>
          <span className="font-bold tracking-tight">Spending insights</span>
        </a>
        {navigation('Main navigation')}
      </aside>

      <div className="md:pl-60">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 shadow-[0_1px_12px_rgba(20,47,43,0.04)] backdrop-blur-xl sm:px-7">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-emerald-700 to-emerald-950 text-sm font-bold text-white shadow-sm md:hidden" aria-hidden="true">S</span>
            <span className="truncate font-semibold text-slate-800 md:hidden">Spending insights</span>
            <span className="hidden text-sm text-slate-500 md:inline">Personal banking / Spending</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-full border border-emerald-100 bg-gradient-to-br from-emerald-50 to-emerald-100 text-xs font-bold text-emerald-900 shadow-sm" aria-hidden="true">{initials}</span>
            <span className="hidden text-sm font-medium text-slate-700 sm:inline">{customerName}</span>
          </div>
        </header>
        {children}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-200 bg-white/95 px-2 pb-[max(env(safe-area-inset-bottom),0.35rem)] pt-1 shadow-[0_-4px_16px_rgba(15,23,42,0.06)] backdrop-blur md:hidden">
        {navigation('Mobile navigation', true)}
      </div>
    </div>
  )
}
