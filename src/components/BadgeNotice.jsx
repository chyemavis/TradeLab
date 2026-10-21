import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

// Calm, short notice when a badge is earned. Not a celebration.
export default function BadgeNotice({ badge, onDone }) {
  useEffect(() => {
    if (!badge) return
    const id = setTimeout(onDone, 3200)
    return () => clearTimeout(id)
  }, [badge, onDone])

  return (
    <AnimatePresence>
      {badge && (
        <motion.div
          role="status"
          className="fixed top-4 inset-x-0 mx-auto w-fit z-[60] flex items-center gap-3 bg-hero text-white rounded-full pl-2 pr-5 py-2 shadow-lg"
          initial={{ y: -40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -40, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <span className="w-8 h-8 rounded-full bg-white/10 grid place-items-center">{badge.icon}</span>
          <span className="text-sm">
            Badge earned: <b>{badge.title}</b>
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
