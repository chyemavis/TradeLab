import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { TERMS } from '../data/terms.js'
import MarketCap from '../animations/MarketCap.jsx'
import PERatio from '../animations/PERatio.jsx'
import Volatility from '../animations/Volatility.jsx'
import Dividend from '../animations/Dividend.jsx'
import UnrealizedGain from '../animations/UnrealizedGain.jsx'

export const ANIMATIONS = { marketCap: MarketCap, peRatio: PERatio, volatility: Volatility, dividend: Dividend, unrealizedGain: UnrealizedGain }

export default function TermSheet({ termId, onClose }) {
  const [run, setRun] = useState(0)
  const term = termId && TERMS[termId]
  const Anim = termId && ANIMATIONS[termId]

  return (
    <AnimatePresence>
      {term && (
        <>
          <motion.div className="fixed inset-0 bg-black/60 z-40" onClick={onClose}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
          <motion.div
            className="fixed bottom-0 inset-x-0 mx-auto w-full max-w-[420px] z-50 bg-surface border-t border-line rounded-t-2xl px-5 pt-3 pb-8"
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-line" />
            <div className="flex items-baseline justify-between">
              <h3 className="text-lg font-semibold">{term.title}</h3>
              <button onClick={onClose} className="text-muted text-sm">Close</button>
            </div>
            <div className="mt-5 h-44 rounded-xl bg-bg border border-line overflow-hidden relative">
              <Anim key={`${termId}-${run}`} />
            </div>
            <button onClick={() => setRun((r) => r + 1)} className="mt-2 text-xs text-muted hover:text-text">↻ Replay</button>
            <p className="mt-4 leading-relaxed text-text/90">{term.explanation}</p>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
