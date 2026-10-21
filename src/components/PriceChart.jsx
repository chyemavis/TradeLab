// Hand-drawn SVG line chart (spec.md > Stack: no chart library).
export default function PriceChart({ data, height = 180 }) {
  const w = 400
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const pts = data.map((v, i) => [(i / (data.length - 1)) * w, height - 8 - ((v - min) / range) * (height - 16)])
  const d = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ')
  const up = data[data.length - 1] >= data[0]
  const color = up ? '#22C55E' : '#EF4444'
  const [lx, ly] = pts[pts.length - 1]

  return (
    <svg viewBox={`0 0 ${w} ${height}`} className="w-full" preserveAspectRatio="none" style={{ height }}>
      <defs>
        <linearGradient id="fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.18" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${d} L${w},${height} L0,${height} Z`} fill="url(#fill)" />
      <path d={d} fill="none" stroke={color} strokeWidth="2" vectorEffect="non-scaling-stroke" />
      <circle cx={lx} cy={ly} r="3.5" fill={color} />
    </svg>
  )
}
