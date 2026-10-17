import { useEffect, useState, type ReactNode } from 'react'
import { Activity, CreditCard, LayoutDashboard, Menu, X } from 'lucide-react'

const links = [
  { label: 'Overview', icon: LayoutDashboard, href: '#overview' },
  { label: 'Transactions', icon: CreditCard, href: '#transactions' },
  { label: 'Insights', icon: Activity, href: '#insights' },
]

export function DashboardShell({ children, customerName }: { children: ReactNode; customerName: string }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeHref, setActiveHref] = useState(() => window.location.hash || '#overview')
  const initials = customerName.split(/\s+/).map((part) => part[0]).slice(0, 2).join('').toUpperCase()

  useEffect(() => {
    const updateActiveLink = () => setActiveHref(window.location.hash || '#overview')
    window.addEventListener('hashchange', updateActiveLink)
    return () => window.removeEventListener('hashchange', updateActiveLink)
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [menuOpen])

  const navigation = (label: string, compact = false) => (
    <nav aria-label={label} className={compact ? 'grid grid-cols-3 gap-1' : 'space-y-1'}>
      {links.map(({ label: linkLabel, icon: Icon, href }) => (
        <a
          key={linkLabel}
          href={href}
          aria-current={activeHref === href ? 'location' : undefined}
          className={`flex rounded-xl text-sm font-medium ${compact ? 'flex-col items-center gap-1 py-2 text-[10px]' : 'items-center gap-3 px-3 py-3'} ${activeHref === href ? 'bg-emerald-50 text-emerald-900' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
          onClick={() => setMenuOpen(false)}
        >
          <Icon size={18} aria-hidden="true" />{linkLabel}
        </a>
      ))}
    </nav>
  )

  return (
    <div className="min-h-screen bg-[#f6f8f7] text-slate-900">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-60 flex-col border-r border-slate-200 bg-white px-4 py-6 md:flex">
        <a href="#overview" className="mb-10 flex items-center gap-3 px-2">
          <span className="grid size-10 place-items-center rounded-xl bg-emerald-800 text-lg font-bold text-white" aria-hidden="true">S</span>
          <span className="font-bold tracking-tight">Spending insights</span>
        </a>
        {navigation('Main navigation')}
      </aside>

      <div className="md:pl-60">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-7">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden"
              aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
            </button>
            <span className="font-semibold text-slate-800 md:hidden">Spending insights</span>
            <span className="hidden text-sm text-slate-500 md:inline">Personal banking / Spending</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-900" aria-hidden="true">{initials}</span>
            <span className="hidden text-sm font-medium text-slate-700 sm:inline">{customerName}</span>
          </div>
        </header>
        {menuOpen && <div id="mobile-menu" className="border-b border-slate-200 bg-white px-4 py-3 md:hidden">{navigation('Mobile menu')}</div>}
        {children}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-200 bg-white px-2 pb-[env(safe-area-inset-bottom)] pt-2 md:hidden">
        {navigation('Mobile navigation', true)}
      </div>
    </div>
  )
}
