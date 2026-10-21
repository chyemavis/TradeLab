import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { money } from '../format.js'

const AMOUNTS = [1000, 5000, 10000]

export default function TopUp({ open, onTopUp, onClose }) {
  const [error, setError] = useState(null)
  const add = (amount) => {
    const err = onTopUp(amount)
    if (err) return setError(err)
    setError(null)
    onClose()
  }
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="fixed inset-0 bg-[#0E0B24]/70 z-40" onClick={onClose}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
          <motion.div
            role="dialog" aria-label="Top up practice cash"
            className="fixed bottom-0 inset-x-0 mx-auto w-full max-w-[420px] z-50 bg-surface rounded-t-3xl px-5 pt-3 pb-8"
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-line" />
            <h3 className="font-display text-2xl font-bold">Top up practice cash</h3>
            <p className="text-lilac text-sm mt-1">It's pretend money, so add as much as you like.</p>
            <div className="grid grid-cols-3 gap-3 mt-6">
              {AMOUNTS.map((a) => (
                <button key={a} onClick={() => add(a)} className="sticker bg-coin text-night px-2">+{money(a).replace('.00', '')}</button>
              ))}
            </div>
            {error && <p role="alert" className="text-loss text-sm mt-3">{error}</p>}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
