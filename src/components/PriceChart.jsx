// Hand-drawn SVG line chart (spec.md > Stack: no chart library).
// `compact` renders a tiny sparkline with no fill or end dot.
export default function PriceChart({ data, height = 180, compact = false, width = 400 }) {
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const pad = compact ? 2 : 10
  const pts = data.map((v, i) => [(i / (data.length - 1)) * width, height - pad - ((v - min) / range) * (height - pad * 2)])
  const d = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ')
  const up = data[data.length - 1] >= data[0]
  const color = up ? 'var(--svg-gain)' : 'var(--svg-loss)'
  const [lx, ly] = pts[pts.length - 1]

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full block" preserveAspectRatio="none" style={{ height }} aria-hidden="true">
      {!compact && <path d={`${d} L${width},${height} L0,${height} Z`} fill={color} opacity="0.08" />}
      <path d={d} fill="none" stroke={color} strokeWidth={compact ? 1.5 : 2.5} strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      {!compact && <circle cx={lx} cy={ly} r="5" fill={color} stroke="var(--svg-bg)" strokeWidth="2" />}
    </svg>
  )
}
