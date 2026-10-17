import { useState, type ReactNode } from 'react'
import { Activity, Bell, CreditCard, LayoutDashboard, Menu, Settings, X } from 'lucide-react'

const links = [
  { label: 'Overview', icon: LayoutDashboard, href: '#overview' },
  { label: 'Transactions', icon: CreditCard, href: '#transactions' },
  { label: 'Insights', icon: Activity, href: '#insights' },
]

export function DashboardShell({ children, customerName }: { children: ReactNode; customerName: string }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const initials = customerName.split(/\s+/).map((part) => part[0]).slice(0, 2).join('').toUpperCase()

  return (
    <div className="min-h-screen bg-[#f6f8f7] text-slate-900">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-60 flex-col border-r border-slate-200 bg-white px-4 py-6 md:flex">
        <a href="#overview" className="mb-10 flex items-center gap-3 px-2"><span className="grid size-10 place-items-center rounded-xl bg-emerald-800 text-lg font-bold text-white">S</span><span className="font-bold tracking-tight">Spending insights</span></a>
        <nav aria-label="Main navigation" className="space-y-1">{links.map(({ label, icon: Icon, href }, index) => <a key={label} href={href} aria-current={index === 0 ? 'page' : undefined} className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium ${index === 0 ? 'bg-emerald-50 text-emerald-900' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}><Icon size={18} aria-hidden="true" />{label}</a>)}</nav>
        <a href="#settings" className="mt-auto flex items-center gap-3 border-t border-slate-100 px-3 pt-5 text-sm text-slate-500"><Settings size={18} aria-hidden="true" />Settings</a>
      </aside>

      <div className="md:pl-60">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-7">
          <div className="flex items-center gap-3"><button type="button" className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden" aria-label={menuOpen ? 'Close menu' : 'Open menu'} onClick={() => setMenuOpen((open) => !open)}>{menuOpen ? <X size={20} /> : <Menu size={20} />}</button><span className="font-semibold text-slate-800 md:hidden">Spending insights</span><span className="hidden text-sm text-slate-500 md:inline">Personal banking / Spending</span></div>
          <div className="flex items-center gap-3"><button type="button" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label="Notifications"><Bell size={19} /></button><span className="grid size-9 place-items-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-900" aria-hidden="true">{initials}</span><span className="hidden text-sm font-medium text-slate-700 sm:inline">{customerName}</span></div>
        </header>
        {menuOpen && <nav className="border-b border-slate-200 bg-white px-4 py-3 md:hidden" aria-label="Mobile menu">{links.map(({ label, icon: Icon, href }) => <a key={label} href={href} className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-slate-700" onClick={() => setMenuOpen(false)}><Icon size={18} aria-hidden="true" />{label}</a>)}</nav>}
        {children}
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-4 border-t border-slate-200 bg-white px-2 pb-[env(safe-area-inset-bottom)] pt-2 md:hidden" aria-label="Mobile navigation">
        {[...links, { label: 'Settings', icon: Settings, href: '#settings' }].map(({ label, icon: Icon }, index) => <a key={label} href={`#${label.toLowerCase()}`} aria-current={index === 0 ? 'page' : undefined} className={`flex flex-col items-center gap-1 py-2 text-[10px] font-medium ${index === 0 ? 'text-emerald-800' : 'text-slate-500'}`}><Icon size={19} aria-hidden="true" />{label}</a>)}
      </nav>
    </div>
  )
}
