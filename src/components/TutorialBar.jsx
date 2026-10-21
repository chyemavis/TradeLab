import { AnimatePresence, motion } from 'framer-motion'

// Guided tour steps. Each advances when its `on` event happens in the real app.
export const TOUR = [
  { on: 'open', text: 'Tap any stock in "Explore stocks" to open it.' },
  { on: 'buyOpen', text: 'This is the stock page. Tap Buy at the bottom.' },
  { on: 'bought', text: 'Keep it at 1 share and tap the Buy button to confirm.' },
  { on: 'sellOpen', text: 'Read what happened, tap "Got it", then tap Sell.' },
  { on: 'sold', text: 'Sell your share and see what you made or lost.' },
]

export default function TutorialBar({ step, onSkip, onFinish }) {
  const done = step === TOUR.length
  return (
    <AnimatePresence>
      {step !== null && (
        <motion.div
          role="status"
          className="fixed top-3 inset-x-3 mx-auto max-w-[396px] z-[55] bg-hero text-white rounded-2xl p-4 shadow-lg"
          initial={{ y: -60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -60, opacity: 0 }}
        >
          <div className="flex items-center justify-between text-xs text-white/60">
            <span>{done ? 'Guided tour complete' : `Guided tour · step ${step + 1} of ${TOUR.length}`}</span>
            {!done && <button onClick={onSkip} className="hover:text-white">End tour</button>}
          </div>
          <motion.p key={step} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-1.5 font-medium leading-snug">
            {done ? 'You made your first practice trade. Explore freely, and tap underlined terms whenever a word is unclear.' : TOUR[step].text}
          </motion.p>
          {done && <button onClick={onFinish} className="btn mt-3 py-2 w-full bg-accent text-white">Start exploring</button>}
          {!done && (
            <div className="flex gap-1 mt-3">
              {TOUR.map((_, k) => (
                <span key={k} className={`h-1 flex-1 rounded-full ${k < step ? 'bg-accent' : k === step ? 'bg-white/70' : 'bg-white/15'}`} />
              ))}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
