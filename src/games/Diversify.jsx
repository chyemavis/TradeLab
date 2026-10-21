import { useState } from 'react'
import { motion } from 'framer-motion'
import { money } from '../format.js'
import { GAME_CASH, SECTORS, CRASH_DROP, OTHERS_GAIN, sectorCrash, evenSplit } from './sim.js'

const STEP = 1000
const empty = () => Object.fromEntries(SECTORS.map((s) => [s, 0]))

// Diversification challenge: split money across sectors, then a crash hits one at random.
export default function Diversify() {
  const [alloc, setAlloc] = useState(empty)
  const [crashed, setCrashed] = useState(null)
  const placed = SECTORS.reduce((t, s) => t + alloc[s], 0)
  const left = GAME_CASH - placed

  const change = (s, d) => setAlloc((a) => ({ ...a, [s]: Math.min(Math.max(0, a[s] + d), a[s] + left) }))
  const reset = () => {
    setAlloc(empty())
    setCrashed(null)
  }

  if (crashed) {
    const yours = sectorCrash(alloc, crashed)
    const allIn = sectorCrash({ [crashed]: GAME_CASH }, crashed)
    const even = sectorCrash(evenSplit(), crashed)
    const biggest = Math.max(...SECTORS.map((s) => alloc[s]))
    const rows = [
      ['You', yours, true],
      [`All-in on ${crashed}`, allIn],
      ['Even split', even],
    ]
    return (
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <div className="hero p-5">
          <p className="text-white/60 text-sm">Market news</p>
          <p className="text-2xl font-bold mt-1">{crashed} crashes {Math.abs(CRASH_DROP * 100)}%</p>
          <p className="text-white/70 text-sm mt-1">Every other sector gains {OTHERS_GAIN * 100}%.</p>
        </div>
        <ul className="card px-4 mt-4">
          {rows.map(([label, v, you]) => (
            <li key={label} className="flex justify-between py-3 border-b border-line last:border-0 num">
              <span className={you ? 'font-semibold' : 'text-muted'}>{label}</span>
              <span className={`font-semibold ${v >= GAME_CASH ? 'text-gain' : 'text-loss'}`}>
                {money(v)} <span className="text-xs">({v >= GAME_CASH ? '▲ +' : '▼ −'}{money(Math.abs(v - GAME_CASH))})</span>
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-4 leading-relaxed">
          {alloc[crashed] === biggest && biggest > GAME_CASH / 2
            ? `Most of your money was in ${crashed}, so one bad event hurt a lot. Spreading it out limits the damage.`
            : alloc[crashed] === 0
              ? `Lucky: you had nothing in ${crashed}. But you couldn't know which sector would crash. Spreading out protects you either way.`
              : 'Because your money was spread out, one sector crashing only hurt part of it. That is diversification.'}
        </p>
        <button onClick={reset} className="btn w-full mt-5 bg-accent text-white">Play again</button>
      </motion.div>
    )
  }

  return (
    <div>
      <p className="text-muted leading-relaxed">
        Split {money(GAME_CASH).replace('.00', '')} across four sectors. Then something will go wrong in one of them. You won't know which.
      </p>
      <ul className="card px-4 mt-4">
        {SECTORS.map((s) => (
          <li key={s} className="flex items-center justify-between py-3 border-b border-line last:border-0">
            <span className="font-medium">{s}</span>
            <div className="flex items-center gap-3">
              <button onClick={() => change(s, -STEP)} disabled={!alloc[s]} className="btn w-9 h-9 px-0 py-0 bg-line text-ink" aria-label={`Less in ${s}`}>−</button>
              <span className="num w-16 text-center font-semibold">{money(alloc[s]).replace('.00', '')}</span>
              <button onClick={() => change(s, STEP)} disabled={!left} className="btn w-9 h-9 px-0 py-0 bg-line text-ink" aria-label={`More in ${s}`}>+</button>
            </div>
          </li>
        ))}
      </ul>
      <p className="text-sm text-muted mt-3 num">{left ? `${money(left).replace('.00', '')} left to place` : 'All money placed.'}</p>
      <button onClick={() => setCrashed(SECTORS[Math.floor(Math.random() * SECTORS.length)])} disabled={left > 0}
        className="btn w-full mt-4 bg-accent text-white">
        Run the market
      </button>
    </div>
  )
}
