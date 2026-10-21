import { motion } from 'framer-motion'

// Shared decorative game effects.

export const SKIES = {
  start: 'linear-gradient(160deg, #3B2D8F 0%, #1E5FBF 60%, #18A0C9 100%)',
  boom: 'linear-gradient(170deg, #39B5FF 0%, #7AD7FF 55%, #FFE48A 100%)',
  flat: 'linear-gradient(170deg, #6B7A99 0%, #9AA8C2 60%, #C9D2E3 100%)',
  crash: 'linear-gradient(170deg, #1A0B3D 0%, #3B1466 55%, #5E1F5C 100%)',
}

export function Sun() {
  return (
    <motion.div className="absolute -top-6 right-8 w-24 h-24" animate={{ rotate: 360 }} transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}>
      {Array.from({ length: 12 }, (_, i) => (
        <span key={i} className="absolute left-1/2 top-1/2 w-1.5 h-24 -ml-[3px] -mt-12 rounded-full bg-[#FFE066]/50" style={{ transform: `rotate(${i * 30}deg)` }} />
      ))}
      <span className="absolute inset-5 rounded-full bg-[#FFD43B] shadow-[0_0_40px_#FFD43B]" />
    </motion.div>
  )
}

export function Clouds({ dark = false }) {
  const tone = dark ? 'bg-[#2A1A4A]/90' : 'bg-white/70'
  return [0, 1, 2].map((i) => (
    <motion.div key={i} className="absolute" style={{ top: 8 + i * 22 }}
      initial={{ x: -160 }} animate={{ x: ['-20%', '110%'] }} transition={{ duration: 14 + i * 5, repeat: Infinity, ease: 'linear', delay: -i * 4 }}>
      <div className={`relative w-28 h-8 rounded-full ${tone}`}>
        <span className={`absolute -top-4 left-5 w-12 h-12 rounded-full ${tone}`} />
        <span className={`absolute -top-2 left-12 w-10 h-10 rounded-full ${tone}`} />
      </div>
    </motion.div>
  ))
}

export function Rain() {
  return Array.from({ length: 36 }, (_, i) => (
    <motion.span key={i} className="absolute w-[2px] h-4 bg-[#9FB8FF]/70 rounded" style={{ left: `${(i * 37) % 100}%` }}
      initial={{ y: -20 }} animate={{ y: 400 }} transition={{ duration: 0.7 + (i % 5) * 0.12, repeat: Infinity, ease: 'linear', delay: (i % 7) * 0.1 }} />
  ))
}

/** Full-area white flash, keyed so it replays each time. */
export function Flash({ id }) {
  return (
    <motion.div key={id} className="absolute inset-0 bg-white pointer-events-none z-20"
      initial={{ opacity: 0.9 }} animate={{ opacity: [0.9, 0, 0.6, 0] }} transition={{ duration: 0.6, times: [0, 0.3, 0.45, 1] }} />
  )
}

const CONFETTI = ['#FF5D8F', '#FFD43B', '#4DD4AC', '#5FD3EA', '#9775FA', '#FF922B']
export function Confetti() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
      {Array.from({ length: 40 }, (_, i) => (
        <motion.span key={i} className="absolute w-2 h-3 rounded-sm" style={{ left: `${(i * 23) % 100}%`, background: CONFETTI[i % CONFETTI.length] }}
          initial={{ y: -20, rotate: 0, opacity: 1 }} animate={{ y: 420, rotate: 360 + i * 20, opacity: [1, 1, 0] }}
          transition={{ duration: 1.8 + (i % 5) * 0.3, delay: (i % 10) * 0.05, ease: 'easeIn' }} />
      ))}
    </div>
  )
}
