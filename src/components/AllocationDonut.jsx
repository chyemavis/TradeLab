import { money } from '../format.js'

// Hand-made SVG donut: how total value splits across cash and each holding.
const PALETTE = ['#0BA5C4', '#6C63FF', '#F2A93B', '#00B386', '#EB5B3C', '#3D7BF5', '#C058D6', '#7C7E8C']
const CASH_COLOR = '#D5DCE7'

export default function AllocationDonut({ slices }) {
  const total = slices.reduce((t, s) => t + s.value, 0)
  const r = 52
  const c = 2 * Math.PI * r
  let offset = 0
  const parts = slices
    .filter((s) => s.value > 0)
    .map((s, i) => {
      const len = (s.value / total) * c
      const part = { ...s, color: s.label === 'Cash' ? CASH_COLOR : PALETTE[i % PALETTE.length], len, offset }
      offset += len
      return part
    })

  return (
    <div className="flex items-center gap-6">
      <svg viewBox="0 0 140 140" className="w-32 h-32 shrink-0 -rotate-90" role="img" aria-label="Allocation chart">
        {parts.map((p) => (
          <circle key={p.label} cx="70" cy="70" r={r} fill="none" stroke={p.color} strokeWidth="18"
            strokeDasharray={`${Math.max(p.len - 1.5, 0.5)} ${c}`} strokeDashoffset={-p.offset} />
        ))}
      </svg>
      <ul className="flex-1 space-y-1.5 text-sm num min-w-0">
        {parts.map((p) => (
          <li key={p.label} className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: p.color }} />
            <span className="truncate">{p.label}</span>
            <span className="ml-auto text-muted">{((p.value / total) * 100).toFixed(0)}%</span>
            <span className="sr-only">{money(p.value)}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
