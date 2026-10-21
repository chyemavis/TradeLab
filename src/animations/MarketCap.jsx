import { motion } from 'framer-motion'

// Many shares × price merge into one "whole company" block.
const COLS = 8
const ROWS = 4

export default function MarketCap() {
  const cells = Array.from({ length: COLS * ROWS }, (_, i) => i)
  return (
    <svg viewBox="0 0 360 176" className="w-full h-full">
      <text x="20" y="24" fill="#A39DC9" fontSize="11">32 shares × $10 each</text>
      {cells.map((i) => {
        const x = 20 + (i % COLS) * 20
        const y = 40 + Math.floor(i / COLS) * 20
        return (
          <motion.rect
            key={i}
            width="14"
            height="14"
            rx="3"
            fill="#FFC84A"
            initial={{ x, y, opacity: 0 }}
            animate={{ x: [x, x, 238 + (i % COLS) * 12], y: [y, y, 44 + Math.floor(i / COLS) * 22], opacity: [0, 1, 1] }}
            transition={{ duration: 2, times: [0, 0.4, 1], delay: i * 0.015, ease: 'easeOut' }}
          />
        )
      })}
      <motion.rect x="232" y="38" width="102" height="96" rx="8" fill="none" stroke="#63E6BE" strokeWidth="2"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.1, duration: 0.4 }} />
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.3 }}>
        <text x="283" y="154" fill="#F3EFFF" fontSize="13" fontWeight="600" textAnchor="middle">= $320</text>
        <text x="283" y="168" fill="#A39DC9" fontSize="10" textAnchor="middle">value of the whole company</text>
        <text x="200" y="92" fill="#A39DC9" fontSize="20" textAnchor="middle">→</text>
      </motion.g>
    </svg>
  )
}
