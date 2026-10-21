import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useAnimationControls } from 'framer-motion'
import { money } from '../format.js'
import { GAME_CASH, SCENARIOS, randomYears, runMix } from './sim.js'

const W = 340
const H = 190
const YEARS = 10
const TICK_MS = 1000
const RUNNERS = [
  { id: 'you', color: 'var(--svg-accent)' },
  { id: 90, label: '90% stocks', color: '#6C63FF' },
  { id: 40, label: '40% stocks', color: '#F2A93B' },
]
const WEATHER = {
  boom: { icon: '☀️', text: 'Boom year! Stocks +25%', cls: 'bg-gain text-white' },
  flat: { icon: '☁️', text: 'Flat year. Stocks +2%', cls: 'bg-line text-ink' },
  crash: { icon: '⛈️', text: 'Crash! Stocks −30%', cls: 'bg-loss text-white' },
}
const MEDALS = ['🥇', '🥈', '🥉']

// Risk vs. reward, played as a year-by-year race between three mixes.
export default function RiskReward() {
  const [pct, setPct] = useState(60)
  const [years, setYears] = useState(null)
  const [shown, setShown] = useState(0) // how many years have played
  const shake = useAnimationControls()
  const playing = years && shown < YEARS
  const finished = years && shown === YEARS

  useEffect(() => {
    if (!playing) return
    const id = setTimeout(() => setShown((n) => n + 1), shown === 0 ? 400 : TICK_MS)
    return () => clearTimeout(id)
  }, [playing, shown])

  useEffect(() => {
    if (years && shown > 0 && years[shown - 1] === 'crash') shake.start({ x: [0, -10, 9, -6, 4, 0], transition: { duration: 0.45 } })
  }, [shown, years, shake])

  const start = () => {
    setYears(randomYears(YEARS))
    setShown(0)
  }

  const paths = years ? RUNNERS.map((r) => ({ ...r, label: r.label || `You (${pct}%)`, path: runMix(r.id === 'you' ? pct : r.id, years) })) : []
  const all = paths.flatMap((p) => p.path)
  const min = Math.min(GAME_CASH * 0.6, ...all)
  const max = Math.max(GAME_CASH * 1.4, ...all)
  const y = (v) => H - 14 - ((v - min) / (max - min)) * (H - 28)
  const x = (i) => 8 + (i / YEARS) * (W - 60)
  const line = (path) => path.slice(0, shown + 1).map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ')
  const now = paths.map((p) => ({ ...p, value: p.path[shown] })).sort((a, b) => b.value - a.value)
  const yourPlace = now.findIndex((p) => p.id === 'you')
  const current = years && shown > 0 ? WEATHER[years[shown - 1]] : null

  if (!years) {
    return (
      <div>
        <p className="text-muted leading-relaxed">
          Set your mix, then race a <b className="text-ink">90% stocks</b> player and a <b className="text-ink">40% stocks</b> player through 10 random market years. The rest of your money sits in savings at +3% a year.
        </p>
        <div className="hero p-5 mt-4">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-white/60 text-xs">Your mix</p>
              <p className="text-4xl font-bold num">{pct}%<span className="text-base font-medium text-white/60"> stocks</span></p>
            </div>
            <p className="text-white/60 text-sm num">{100 - pct}% savings</p>
          </div>
          <div className="flex h-3 rounded-full overflow-hidden mt-4 bg-white/10">
            <motion.div className="bg-[#5FD3EA]" animate={{ width: `${pct}%` }} transition={{ type: 'spring', stiffness: 300, damping: 30 }} />
          </div>
          <input type="range" min="0" max="100" step="10" value={pct} onChange={(e) => setPct(+e.target.value)}
            className="w-full mt-3 accent-[#5FD3EA]" aria-label="Percent in stocks" />
          <div className="flex justify-between text-xs text-white/50"><span>🛡️ Safer</span><span>Riskier 🚀</span></div>
        </div>
        <motion.button whileTap={{ scale: 0.96 }} onClick={start} className="btn w-full mt-4 bg-accent text-white text-lg">Start the race</motion.button>
      </div>
    )
  }

  return (
    <motion.div animate={shake}>
      <div className="flex items-center justify-between">
        <p className="text-muted text-sm">Year</p>
        <p className="text-muted text-sm num">{shown} / {YEARS}</p>
      </div>
      <div className="h-1.5 bg-line rounded-full mt-1 overflow-hidden">
        <motion.div className="h-full bg-accent" animate={{ width: `${(shown / YEARS) * 100}%` }} />
      </div>

      <div className="h-12 mt-3 relative">
        <AnimatePresence mode="popLayout">
          {current && !finished && (
            <motion.div key={shown} className={`absolute inset-x-0 mx-auto w-fit rounded-full px-4 py-2 font-semibold shadow ${current.cls}`}
              initial={{ scale: 0.4, opacity: 0, y: -10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 22 }}>
              <span className="text-xl mr-1">{current.icon}</span> {current.text}
            </motion.div>
          )}
          {finished && (
            <motion.p key="done" className="text-center font-bold text-lg" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>🏁 Race over!</motion.p>
          )}
        </AnimatePresence>
      </div>

      <div className="card p-2">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Race of three mixes over 10 years">
          <line x1="8" x2={W - 52} y1={y(GAME_CASH)} y2={y(GAME_CASH)} stroke="var(--svg-line)" strokeDasharray="4 4" />
          <text x={W - 48} y={y(GAME_CASH) + 4} fontSize="9" fill="var(--svg-muted)">start</text>
          {years.slice(0, shown).map((yr, i) => (
            <rect key={i} x={x(i)} y="0" width={x(1) - x(0)} height={H} fill={yr === 'crash' ? 'var(--svg-loss)' : yr === 'boom' ? 'var(--svg-gain)' : 'transparent'} opacity="0.06" />
          ))}
          {paths.map((p) => (
            <g key={p.id}>
              <path d={line(p.path)} fill="none" stroke={p.color} strokeWidth={p.id === 'you' ? 3.5 : 2.2} strokeLinejoin="round" strokeLinecap="round" />
              <motion.circle r={p.id === 'you' ? 6 : 4.5} fill={p.color} stroke="white" strokeWidth="2"
                animate={{ cx: x(shown), cy: y(p.path[shown]) }} transition={{ duration: 0.5, ease: 'easeOut' }} />
            </g>
          ))}
        </svg>
      </div>

      {!finished ? (
        <ul className="mt-3 space-y-2">
          {now.map((p, rank) => (
            <motion.li layout key={p.id} className={`flex items-center gap-2 rounded-xl px-3 py-2 ${p.id === 'you' ? 'bg-accent/10' : ''}`}>
              <span className="w-5 text-muted num">{rank + 1}</span>
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: p.color }} />
              <span className={`flex-1 ${p.id === 'you' ? 'font-semibold' : ''}`}>{p.label}</span>
              <span className="num font-semibold">{money(p.value)}</span>
            </motion.li>
          ))}
        </ul>
      ) : (
        <div className="mt-4">
          <div className="flex items-end justify-center gap-2">
            {[1, 0, 2].map((rank) => {
              const p = now[rank]
              return (
                <motion.div key={p.id} className="flex-1 text-center"
                  initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 + (2 - rank) * 0.25, type: 'spring' }}>
                  <div className="text-2xl">{MEDALS[rank]}</div>
                  <p className={`text-xs mt-1 ${p.id === 'you' ? 'font-bold text-accent' : 'text-muted'}`}>{p.label}</p>
                  <p className="num text-sm font-semibold">{money(p.value).replace(/\.\d+$/, '')}</p>
                  <div className={`mt-1 rounded-t-xl ${p.id === 'you' ? 'bg-accent' : 'bg-line'}`} style={{ height: [72, 52, 36][rank] }} />
                </motion.div>
              )
            })}
          </div>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="mt-4 leading-relaxed">
            {yourPlace === 0 ? 'You won this race. ' : `You came ${['first', 'second', 'third'][yourPlace]}. `}
            {years.filter((v) => v === 'crash').length >= 3
              ? 'Lots of crashes this time, so safer mixes held up better.'
              : 'Mostly good years, so riskier mixes pulled ahead. In real markets you never know which kind of decade you get.'}
          </motion.p>
          <div className="flex gap-3 mt-4">
            <motion.button whileTap={{ scale: 0.96 }} onClick={start} className="btn flex-1 bg-accent text-white">Race again</motion.button>
            <motion.button whileTap={{ scale: 0.96 }} onClick={() => setYears(null)} className="btn flex-1 bg-line text-ink">Change mix</motion.button>
          </div>
        </div>
      )}
    </motion.div>
  )
}
