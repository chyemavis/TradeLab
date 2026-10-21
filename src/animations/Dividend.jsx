import { motion } from 'framer-motion'
import { useCountUp } from './useCountUp.js'

// The company drops cash into your balance just for holding its shares.
const COINS = 4

export default function Dividend() {
  const cash = useCountUp(30, COINS * 450, 300)
  return (
    <svg viewBox="0 0 360 176" className="w-full h-full">
      <rect x="120" y="12" width="120" height="34" rx="8" fill="#262055" stroke="#352D6E" />
      <text x="180" y="33" fill="#F3EFFF" fontSize="12" textAnchor="middle">Company</text>
      {Array.from({ length: COINS }, (_, i) => (
        <motion.g key={i} initial={{ y: 30, opacity: 0 }} animate={{ y: [30, 30, 118], opacity: [0, 1, 0] }}
          transition={{ duration: 0.9, times: [0, 0.15, 1], delay: 0.3 + i * 0.45, ease: 'easeIn' }}>
          <circle cx={168 + (i % 2) * 24} cy="30" r="9" fill="#FFC84A" />
          <text x={168 + (i % 2) * 24} y="34" fontSize="10" textAnchor="middle" fill="#1B1640" fontWeight="700">$</text>
        </motion.g>
      ))}
      <rect x="90" y="128" width="180" height="40" rx="8" fill="#262055" stroke="#63E6BE" />
      <text x="180" y="144" fill="#A39DC9" fontSize="10" textAnchor="middle">Your cash, for owning $1,000 of stock</text>
      <text x="180" y="160" fill="#63E6BE" fontSize="13" fontWeight="600" textAnchor="middle">+${cash.toFixed(0)} a year (3%)</text>
    </svg>
  )
}
