import { motion } from 'framer-motion'

// Same start, same end, very different rides.
const CALM = 'M20,120 C80,112 140,104 200,92 S300,64 340,56'
const WILD = 'M20,120 L45,70 L65,140 L90,40 L115,128 L140,30 L165,150 L190,60 L215,118 L240,22 L265,104 L290,36 L315,96 L340,56'

export default function Volatility() {
  const t = { duration: 1.8, ease: 'easeInOut' }
  return (
    <svg viewBox="0 0 360 176" className="w-full h-full">
      <motion.path d={WILD} fill="none" stroke="#EF4444" strokeWidth="2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={t} />
      <motion.path d={CALM} fill="none" stroke="#22C55E" strokeWidth="2.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={t} />
      <circle cx="20" cy="120" r="4" fill="#E8ECF1" />
      <motion.circle cx="340" cy="56" r="4" fill="#E8ECF1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }} />
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }} fontSize="11">
        <text x="20" y="168" fill="#22C55E">● Low volatility: smooth ride</text>
        <text x="200" y="168" fill="#EF4444">● High: bumpy ride</text>
      </motion.g>
    </svg>
  )
}
