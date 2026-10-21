import { motion } from 'framer-motion'
import { useCountUp } from './useCountUp.js'

// One share's price vs. yearly profit: how many years of profit does the price buy?
const YEARS = 30

export default function PERatio() {
  const filled = Math.round(useCountUp(YEARS, 1800, 600))
  return (
    <svg viewBox="0 0 360 176" className="w-full h-full">
      <text x="70" y="22" fill="#8A94A3" fontSize="11" textAnchor="middle">You pay for 1 share</text>
      <motion.rect x="40" width="60" rx="4" fill="#7C9CFF"
        initial={{ y: 150, height: 0 }} animate={{ y: 34, height: 116 }} transition={{ duration: 0.5 }} />
      <text x="70" y="168" fill="#E8ECF1" fontSize="12" fontWeight="600" textAnchor="middle">$300</text>
      <text x="270" y="22" fill="#8A94A3" fontSize="11" textAnchor="middle">It earns $10 profit a year</text>
      {Array.from({ length: filled }, (_, i) => (
        <rect key={i} x={230 + (i % 3) * 28} y={141 - Math.floor(i / 3) * 10.7} width="24" height="8" rx="2" fill="#22C55E" />
      ))}
      <text x="270" y="168" fill="#E8ECF1" fontSize="12" fontWeight="600" textAnchor="middle">{filled} years of profit</text>
      <motion.text x="170" y="96" fill="#E8ECF1" fontSize="14" fontWeight="600" textAnchor="middle"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }}>
        P/E = {YEARS}
      </motion.text>
    </svg>
  )
}
