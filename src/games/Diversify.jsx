import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useAnimationControls } from 'framer-motion'
import { money } from '../format.js'
import { useCountUp } from '../animations/useCountUp.js'
import { GAME_CASH, SECTORS, CRASH_DROP, OTHERS_GAIN, sectorCrash, evenSplit } from './sim.js'

const STEP = 1000
const ICONS = { Tech: '💻', Energy: '⚡', Health: '🩺', Consumer: '🛍️' }
const empty = () => Object.fromEntries(SECTORS.map((s) => [s, 0]))

// A basket that shows its money as a stack of coins.
function Basket({ sector, amount, state, highlight, onAdd, onRemove, canAdd, locked }) {
  const coins = Math.round(amount / STEP)
  const shown = state === 'crashed' ? Math.ceil(coins / 2) : coins
  return (
    <motion.div
      className={`card p-3 flex flex-col items-center relative overflow-hidden ${highlight ? 'ring-2 ring-practice' : ''} ${state === 'crashed' ? 'bg-loss/5' : ''}`}
      animate={state === 'crashed' ? { x: [0, -8, 8, -5, 5, 0] } : { x: 0 }} transition={{ duration: 0.5 }}
    >
      <span className="text-2xl">{ICONS[sector]}</span>
      <span className="text-sm font-semibold mt-1">{sector}</span>
      <div className="h-24 w-14 mt-2 flex flex-col-reverse items-center gap-[2px]">
        <AnimatePresence>
          {Array.from({ length: shown }, (_, i) => (
            <motion.span key={i} className="w-12 h-[7px] rounded-full bg-[#F2A93B] border border-[#C9821C] shrink-0"
              initial={{ y: -60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0, rotate: 30 }}
              transition={{ type: 'spring', stiffness: 400, damping: 24 }} />
          ))}
        </AnimatePresence>
      </div>
      <span className={`num text-sm font-semibold mt-1 ${state === 'crashed' ? 'text-loss' : state === 'grew' && amount ? 'text-gain' : ''}`}>
        {money(state === 'crashed' ? amount * (1 + CRASH_DROP) : state === 'grew' ? amount * (1 + OTHERS_GAIN) : amount).replace(/\.\d+$/, '')}
      </span>
      {!locked && (
        <div className="flex gap-2 mt-2">
          <motion.button whileTap={{ scale: 0.85 }} onClick={onRemove} disabled={!amount} className="btn w-8 h-8 p-0 bg-line text-ink" aria-label={`Less in ${sector}`}>−</motion.button>
          <motion.button whileTap={{ scale: 0.85 }} onClick={onAdd} disabled={!canAdd} className="btn w-8 h-8 p-0 bg-accent text-white" aria-label={`More in ${sector}`}>+</motion.button>
        </div>
      )}
      <AnimatePresence>
        {state === 'crashed' && (
          <motion.span className="absolute top-1 right-2 text-3xl" initial={{ scale: 3, opacity: 0, y: -30 }} animate={{ scale: 1, opacity: 1, y: 0 }}>⚡</motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function Total({ value }) {
  const delta = useCountUp(value - GAME_CASH, 1200, 300)
  return (
    <span className={delta >= 0 ? 'text-gain' : 'text-loss'}>
      {money(GAME_CASH + delta)}
    </span>
  )
}

// Diversification challenge: fill sector baskets, then a crash strikes one at random.
export default function Diversify() {
  const [alloc, setAlloc] = useState(empty)
  const [phase, setPhase] = useState('build') // build | spinning | result
  const [spot, setSpot] = useState(0)
  const [crashed, setCrashed] = useState(null)
  const shake = useAnimationControls()
  const left = GAME_CASH - SECTORS.reduce((t, s) => t + alloc[s], 0)

  useEffect(() => {
    if (phase !== 'spinning') return
    const target = Math.floor(Math.random() * SECTORS.length)
    const hops = 12 + target // ends on the target after a few laps
    let n = 0
    let id
    const hop = () => {
      n += 1
      setSpot(n % SECTORS.length)
      if (n < hops) id = setTimeout(hop, 70 + n * 14) // slows down like a wheel
      else {
        setCrashed(SECTORS[target])
        setPhase('result')
        shake.start({ x: [0, -12, 10, -6, 3, 0], transition: { duration: 0.5 } })
      }
    }
    id = setTimeout(hop, 80)
    return () => clearTimeout(id)
  }, [phase, shake])

  const change = (s, d) => setAlloc((a) => ({ ...a, [s]: Math.min(Math.max(0, a[s] + d), a[s] + left) }))
  const reset = () => {
    setAlloc(empty())
    setCrashed(null)
    setPhase('build')
  }

  const yours = crashed ? sectorCrash(alloc, crashed) : GAME_CASH
  const kept = yours / GAME_CASH
  const stars = kept >= 0.95 ? 3 : kept >= 0.8 ? 2 : 1

  return (
    <motion.div animate={shake}>
      <AnimatePresence mode="wait">
        {phase === 'build' && (
          <motion.p key="b" exit={{ opacity: 0 }} className="text-muted leading-relaxed">
            Drop your coins into four sector baskets. Then a surprise crash will hit one of them. You won't know which.
          </motion.p>
        )}
        {phase === 'spinning' && (
          <motion.p key="s" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="font-semibold text-center py-1">
            📰 Breaking news incoming…
          </motion.p>
        )}
        {phase === 'result' && (
          <motion.div key="r" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="hero p-4 text-center">
            <p className="text-white/60 text-xs">Breaking news</p>
            <p className="text-xl font-bold">⚡ {crashed} crashes {Math.abs(CRASH_DROP * 100)}%</p>
            <p className="text-white/70 text-sm">Every other sector gains {OTHERS_GAIN * 100}%.</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-4 gap-2 mt-4">
        {SECTORS.map((s, i) => (
          <Basket key={s} sector={s} amount={alloc[s]} locked={phase !== 'build'} canAdd={left > 0}
            highlight={phase === 'spinning' && spot === i}
            state={phase === 'result' ? (s === crashed ? 'crashed' : 'grew') : null}
            onAdd={() => change(s, STEP)} onRemove={() => change(s, -STEP)} />
        ))}
      </div>

      {phase === 'build' && (
        <>
          <p className="text-sm text-muted mt-3 num text-center">{left ? `🪙 ${left / STEP} coins ($${left.toLocaleString()}) left to place` : 'All coins placed. Ready?'}</p>
          <motion.button whileTap={{ scale: 0.96 }} onClick={() => setPhase('spinning')} disabled={left > 0} className="btn w-full mt-3 bg-accent text-white text-lg">
            Run the market
          </motion.button>
        </>
      )}

      {phase === 'result' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mt-4">
          <div className="text-center">
            <div className="text-3xl tracking-widest">
              {[0, 1, 2].map((i) => (
                <motion.span key={i} initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.8 + i * 0.2, type: 'spring' }}
                  className={i < stars ? '' : 'grayscale opacity-30'}>⭐</motion.span>
              ))}
            </div>
            <p className="text-muted text-sm mt-2">You now have</p>
            <p className="text-4xl font-bold num"><Total value={yours} /></p>
          </div>
          <ul className="card px-4 mt-4 text-sm">
            {[[`All-in on ${crashed}`, sectorCrash({ [crashed]: GAME_CASH }, crashed)], ['Even split', sectorCrash(evenSplit(), crashed)]].map(([label, v]) => (
              <li key={label} className="flex justify-between py-2.5 border-b border-line last:border-0 num">
                <span className="text-muted">{label} would have</span>
                <span className={`font-semibold ${v >= GAME_CASH ? 'text-gain' : 'text-loss'}`}>{money(v)}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 leading-relaxed">
            {alloc[crashed] > GAME_CASH / 2
              ? `Most of your coins were in ${crashed}, so one bad event hit hard. Spreading out limits the damage.`
              : alloc[crashed] === 0
                ? `Lucky dodge: nothing was in ${crashed}. But you couldn't know which sector would crash, and spreading out protects you either way.`
                : 'Your coins were spread out, so the crash only hurt part of them. That is diversification.'}
          </p>
          <motion.button whileTap={{ scale: 0.96 }} onClick={reset} className="btn w-full mt-4 bg-accent text-white">Play again</motion.button>
        </motion.div>
      )}
    </motion.div>
  )
}
