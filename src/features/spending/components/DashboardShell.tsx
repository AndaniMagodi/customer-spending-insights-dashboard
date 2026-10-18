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
          className={`flex rounded-xl text-sm font-medium transition-all duration-200 ${compact ? 'min-h-12 flex-col items-center justify-center gap-1 py-1 text-[10px]' : 'items-center gap-3 px-3 py-3'} ${activeHref === href ? (compact ? 'bg-emerald-50 text-emerald-900 shadow-sm ring-1 ring-emerald-100' : 'bg-[#b7eb69] text-[#17392d] shadow-sm') : (compact ? 'text-slate-500 hover:bg-slate-50 hover:text-slate-900' : 'text-emerald-50/65 hover:translate-x-0.5 hover:bg-white/10 hover:text-white')}`}
        >
          <Icon size={18} aria-hidden="true" />{linkLabel}
        </a>
      ))}
    </nav>
  )

  return (
    <div className="dashboard-background min-h-screen text-slate-900">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-60 flex-col border-r border-white/10 bg-[#102f27] px-4 py-6 text-white md:flex">
        <a href="#overview" className="mb-10 flex items-center gap-3 px-2">
          <span className="brand-mark grid size-10 place-items-center rounded-xl shadow-md shadow-black/15" aria-hidden="true"><span className="brand-mark-bars"><span /><span /><span /></span></span>
          <span><span className="block font-bold tracking-tight">Spending insights</span><span className="mt-0.5 block text-[9px] font-semibold uppercase tracking-[0.2em] text-emerald-50/50">Personal money</span></span>
        </a>
        <p className="mb-2 px-3 text-[9px] font-bold uppercase tracking-[0.2em] text-emerald-50/35">Your account</p>
        {navigation('Main navigation')}
        <div className="mt-auto mx-2 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#b7eb69]">A clearer picture</p>
          <p className="mt-2 text-xs leading-relaxed text-emerald-50/65">Small daily choices add up. Keep an eye on the patterns that matter to you.</p>
          <div aria-hidden="true" className="mt-4 flex h-8 items-end gap-1">
            {[35, 58, 44, 76, 55, 92, 68, 100].map((height, index) => <span key={index} className="flex-1 rounded-t-sm bg-[#b7eb69]/70" style={{ height: `${height}%` }} />)}
          </div>
        </div>
      </aside>

      <div className="md:pl-60">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-[#dfe6dc] bg-[#f8f9f5]/95 px-4 backdrop-blur-xl sm:px-7">
          <div className="flex min-w-0 items-center gap-3">
            <span className="brand-mark grid size-8 shrink-0 place-items-center rounded-lg shadow-sm md:hidden" aria-hidden="true"><span className="brand-mark-bars scale-75"><span /><span /><span /></span></span>
            <span className="truncate font-semibold text-slate-800 md:hidden">Spending insights</span>
            <span className="hidden items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#65756a] md:flex"><span className="size-1.5 rounded-full bg-[#4a8f66]" aria-hidden="true" />Personal banking <span className="text-[#b4beb3]">/</span> Spending</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-full border border-[#d5e3cf] bg-[#e5f0dc] text-xs font-bold text-[#244735]" aria-hidden="true">{initials}</span>
            <span className="hidden text-sm font-medium text-slate-700 sm:inline">{customerName}</span>
          </div>
        </header>
        {children}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-[#dfe6dc] bg-[#f8f9f5]/95 px-2 pb-[max(env(safe-area-inset-bottom),0.35rem)] pt-1 shadow-[0_-4px_16px_rgba(15,23,42,0.06)] backdrop-blur md:hidden">
        {navigation('Mobile navigation', true)}
      </div>
    </div>
  )
}
