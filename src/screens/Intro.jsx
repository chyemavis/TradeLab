import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const CARDS = [
  {
    art: '$',
    title: 'Practice investing with pretend money',
    body: "You start with $10,000 that isn't real. Buy and sell stocks the way you would in a real trading app, with nothing to lose.",
  },
  {
    art: 'ⓘ',
    title: 'Learn the words as you go',
    body: 'Investing is full of jargon. Tap any underlined term, like P/E ratio, to see what it means with a short animation.',
  },
  {
    art: '↗',
    title: 'Watch your choices play out',
    body: 'Prices move every few seconds (simulated, not real market data), so you can see gains and losses happen.',
  },
]

// First-open intro (prd.md > Intro and Guided Tutorial): a few cards, then tour or skip.
export default function Intro({ onTour, onSkip }) {
  const [i, setI] = useState(0)
  const last = i === CARDS.length - 1
  const card = CARDS[i]

  return (
    <div className="min-h-screen flex flex-col px-6 pt-6 pb-10">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-practice bg-accent/10 rounded-md px-2 py-0.5">Practice</span>
        {!last && <button onClick={onSkip} className="text-muted text-sm hover:text-ink">Skip</button>}
      </div>

      <div className="flex-1 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          <motion.div key={i} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.25 }}>
            <div className="hero w-20 h-20 grid place-items-center text-3xl font-bold">{card.art}</div>
            <h1 className="text-3xl font-bold mt-8 leading-tight">{card.title}</h1>
            <p className="text-muted text-[17px] leading-relaxed mt-3">{card.body}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex justify-center gap-1.5 mb-6" aria-label={`Card ${i + 1} of ${CARDS.length}`}>
        {CARDS.map((_, k) => (
          <span key={k} className={`h-1.5 rounded-full transition-all ${k === i ? 'w-6 bg-accent' : 'w-1.5 bg-line'}`} />
        ))}
      </div>

      {last ? (
        <div className="space-y-3">
          <button onClick={onTour} className="btn w-full bg-accent text-white text-lg">Take the guided tour</button>
          <button onClick={onSkip} className="btn w-full bg-line/60 text-ink">Skip, I'll explore on my own</button>
        </div>
      ) : (
        <button onClick={() => setI(i + 1)} className="btn w-full bg-accent text-white text-lg">Next</button>
      )}
    </div>
  )
}
