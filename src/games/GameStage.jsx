import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

// Full-screen landscape stage for games. On an upright phone the stage is turned
// sideways (like a mobile game); where supported we also request fullscreen + landscape lock.
function usePortraitPhone() {
  const query = '(orientation: portrait) and (max-width: 700px)'
  const [portrait, setPortrait] = useState(() => window.matchMedia(query).matches)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const on = () => setPortrait(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return portrait
}

export default function GameStage({ title, onExit, children, background }) {
  const portrait = usePortraitPhone()

  useEffect(() => {
    const el = document.documentElement
    if (window.matchMedia('(pointer: coarse)').matches && el.requestFullscreen) {
      el.requestFullscreen()
        .then(() => screen.orientation?.lock?.('landscape'))
        .catch(() => {}) // not supported: the rotated stage below still works
    }
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
      if (document.fullscreenElement) document.exitFullscreen().catch(() => {})
    }
  }, [])

  const stageStyle = portrait
    ? { width: '100vh', height: '100vw', transform: 'rotate(90deg)', transformOrigin: 'top left', position: 'absolute', top: 0, left: '100vw' }
    : { width: 'min(100vw, calc(100vh * 16 / 9))', height: 'min(100vh, calc(100vw * 9 / 16))' }

  return (
    <div className="fixed inset-0 z-[70] bg-[#0A0820] grid place-items-center overflow-hidden">
      <motion.div style={stageStyle} className="relative overflow-hidden text-white sm:rounded-2xl"
        initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
        <div className="absolute inset-0" style={{ background }} />
        <div className="relative h-full flex flex-col">
          <div className="flex items-center justify-between px-4 pt-3">
            <button onClick={onExit} className="rounded-full bg-white/15 hover:bg-white/25 px-3 py-1 text-sm font-medium backdrop-blur">✕ Exit</button>
            <p className="font-bold tracking-wide drop-shadow">{title}</p>
            <span className="text-xs bg-white/15 rounded-full px-2 py-1">Game money</span>
          </div>
          <div className="flex-1 min-h-0 px-4 pb-3 pt-2">{children}</div>
        </div>
      </motion.div>
    </div>
  )
}
