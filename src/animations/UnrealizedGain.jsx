import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

// Value floats on paper until you sell; then it's locked in.
const VALUES = [0, 18, 9, 31, 22, 42, 28, 38]

export default function UnrealizedGain() {
  const [i, setI] = useState(0)
  const sold = i >= VALUES.length
  useEffect(() => {
    if (sold) return
    const id = setTimeout(() => setI((n) => n + 1), 420)
    return () => clearTimeout(id)
  }, [i, sold])

  const shown = VALUES.slice(0, Math.min(i + 1, VALUES.length))
  const v = shown[shown.length - 1]
  const pts = shown.map((g, k) => `${30 + k * 40},${110 - g * 1.8}`).join(' ')

  return (
    <svg viewBox="0 0 360 176" className="w-full h-full">
      <line x1="30" x2="330" y1="110" y2="110" stroke="var(--svg-line)" strokeDasharray="4 4" />
      <text x="30" y="124" fill="var(--svg-muted)" fontSize="10">what you paid</text>
      <polyline points={pts} fill="none" stroke={sold ? 'var(--svg-gain)' : 'var(--svg-coin)'} strokeWidth="2" />
      <text x="30" y="24" fill="var(--svg-muted)" fontSize="11">{sold ? 'Realized: locked in as cash' : 'Unrealized: on paper, still moving'}</text>
      <text x="30" y="46" fill={sold ? 'var(--svg-gain)' : 'var(--svg-ink)'} fontSize="18" fontWeight="600">+${v}</text>
      {sold ? (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <rect x="250" y="138" width="80" height="26" rx="6" fill="var(--svg-gain)" />
          <text x="290" y="155" fill="var(--svg-bg)" fontSize="11" fontWeight="700" textAnchor="middle">Sold ✓</text>
        </motion.g>
      ) : (
        <g>
          <rect x="250" y="138" width="80" height="26" rx="6" fill="none" stroke="var(--svg-muted)" />
          <text x="290" y="155" fill="var(--svg-muted)" fontSize="11" textAnchor="middle">Sell</text>
        </g>
      )}
    </svg>
  )
}
