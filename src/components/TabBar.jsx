const TABS = [
  { id: 'home', label: 'Home', icon: (
    <path d="M4 11.5 12 5l8 6.5V20a1 1 0 0 1-1 1h-5v-6h-4v6H5a1 1 0 0 1-1-1z" />
  ) },
  { id: 'explore', label: 'Explore', icon: (
    <path d="M4 17l5-5 4 4 7-8M15 8h5v5" />
  ) },
  { id: 'games', label: 'Games', icon: (
    <path d="M7 8h10a4 4 0 0 1 4 4v2a3 3 0 0 1-5.4 1.8L14.5 14h-5l-1.1 1.8A3 3 0 0 1 3 14v-2a4 4 0 0 1 4-4zM8 10.5v3M6.5 12h3M15.5 11.5h.01M17.5 13h.01" />
  ) },
  { id: 'learn', label: 'Learn', icon: (
    <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H11v16H5.5A1.5 1.5 0 0 1 4 18.5zM13 4h5.5A1.5 1.5 0 0 1 20 5.5v13a1.5 1.5 0 0 1-1.5 1.5H13z" />
  ) },
]

export default function TabBar({ tab, onTab }) {
  return (
    <nav className="fixed bottom-0 inset-x-0 mx-auto max-w-[420px] z-30 bg-surface/95 backdrop-blur border-t border-line grid grid-cols-4 pb-[env(safe-area-inset-bottom)]">
      {TABS.map((t) => {
        const on = t.id === tab
        return (
          <button key={t.id} onClick={() => onTab(t.id)} aria-current={on ? 'page' : undefined}
            className={`flex flex-col items-center gap-1 py-2.5 text-xs font-medium ${on ? 'text-accent' : 'text-muted hover:text-ink'}`}>
            <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={on ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              {t.icon}
            </svg>
            {t.label}
          </button>
        )
      })}
    </nav>
  )
}
