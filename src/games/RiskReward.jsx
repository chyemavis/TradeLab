import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useAnimationControls } from 'framer-motion'
import { money } from '../format.js'
import { GAME_CASH, randomYears, runMix } from './sim.js'
import { SKIES, Sun, Clouds, Rain, Flash, Confetti } from './Effects.jsx'

const W = 520
const H = 240
const YEARS = 10
const TICK_MS = 1100
const RUNNERS = [
  { id: 'you', icon: '🚀', color: '#5FF2D0' },
  { id: 90, icon: '🐆', label: '90% stocks', color: '#FF5D8F' },
  { id: 40, icon: '🐢', label: '40% stocks', color: '#FFD43B' },
]
const BANNER = {
  boom: { text: '☀️ Boom year! Stocks +25%', cls: 'bg-[#FFD43B] text-[#3A2A00]' },
  flat: { text: '☁️ Flat year. Stocks +2%', cls: 'bg-white text-[#3A4660]' },
  crash: { text: '⛈️ Crash! Stocks −30%', cls: 'bg-[#FF3B5C] text-white' },
}
const MEDALS = ['🥇', '🥈', '🥉']

// Risk vs. reward, played as a year-by-year race through changing market weather.
export default function RiskReward() {
  const [pct, setPct] = useState(60)
  const [years, setYears] = useState(null)
  const [shown, setShown] = useState(0)
  const shake = useAnimationControls()
  const playing = years && shown < YEARS
  const finished = years && shown === YEARS
  const weather = years && shown > 0 ? years[shown - 1] : null

  useEffect(() => {
    if (!playing) return
    const id = setTimeout(() => setShown((n) => n + 1), shown === 0 ? 500 : TICK_MS)
    return () => clearTimeout(id)
  }, [playing, shown])

  useEffect(() => {
    if (weather === 'crash') shake.start({ x: [0, -14, 12, -8, 5, 0], transition: { duration: 0.5 } })
  }, [shown, weather, shake])

  const start = () => {
    setYears(randomYears(YEARS))
    setShown(0)
  }

  const paths = years ? RUNNERS.map((r) => ({ ...r, label: r.label || `You (${pct}%)`, path: runMix(r.id === 'you' ? pct : r.id, years) })) : []
  const all = paths.flatMap((p) => p.path)
  const min = Math.min(GAME_CASH * 0.6, ...all)
  const max = Math.max(GAME_CASH * 1.5, ...all)
  const y = (v) => H - 18 - ((v - min) / (max - min)) * (H - 40)
  const x = (i) => 12 + (i / YEARS) * (W - 40)
  const line = (path) => path.slice(0, shown + 1).map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ')
  const ranked = paths.map((p) => ({ ...p, value: p.path[shown] })).sort((a, b) => b.value - a.value)
  const yourPlace = ranked.findIndex((p) => p.id === 'you')

  return (
    <motion.div animate={shake} className="h-full grid grid-cols-[minmax(0,1fr)_minmax(0,1.7fr)] gap-3">
      {/* Left panel: setup, live leaderboard, or podium */}
      <div className="rounded-2xl bg-black/25 backdrop-blur p-3 flex flex-col min-h-0">
        {!years && (
          <>
            <p className="text-white/70 text-sm leading-snug">Set your mix and race a 🐆 90% stocks player and a 🐢 40% stocks player through 10 market years.</p>
            <p className="text-5xl font-black num mt-3 bg-gradient-to-r from-[#5FF2D0] to-[#5FD3EA] bg-clip-text text-transparent">{pct}%</p>
            <p className="text-white/70 text-sm">in stocks · {100 - pct}% safe savings (+3%/yr)</p>
            <input type="range" min="0" max="100" step="10" value={pct} onChange={(e) => setPct(+e.target.value)}
              className="w-full mt-3 accent-[#5FF2D0]" aria-label="Percent in stocks" />
            <div className="flex justify-between text-xs text-white/60"><span>🛡️ Safer</span><span>Riskier 🚀</span></div>
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.94 }} onClick={start}
              className="mt-auto rounded-xl py-3 font-black text-lg text-[#14103A] bg-gradient-to-r from-[#5FF2D0] to-[#FFD43B] shadow-[0_6px_0_#0E8C78]">
              START RACE
            </motion.button>
          </>
        )}

        {years && !finished && (
          <>
            <p className="text-xs text-white/60">Year {shown} of {YEARS}</p>
            <div className="h-2 bg-white/15 rounded-full mt-1 overflow-hidden">
              <motion.div className="h-full bg-gradient-to-r from-[#5FF2D0] to-[#FFD43B]" animate={{ width: `${(shown / YEARS) * 100}%` }} />
            </div>
            <ul className="mt-3 space-y-2">
              {ranked.map((p, rank) => (
                <motion.li layout key={p.id} transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className={`flex items-center gap-2 rounded-xl px-2 py-1.5 ${p.id === 'you' ? 'bg-white/20 ring-1 ring-[#5FF2D0]' : 'bg-white/5'}`}>
                  <span className="text-xs w-3 text-white/60">{rank + 1}</span>
                  <span className="text-lg">{p.icon}</span>
                  <span className="flex-1 text-sm truncate">{p.label}</span>
                  <span className="num text-sm font-bold" style={{ color: p.color }}>{money(p.value).replace(/\.\d+$/, '')}</span>
                </motion.li>
              ))}
            </ul>
          </>
        )}

        {finished && (
          <>
            <p className="text-center font-black text-lg">🏁 {yourPlace === 0 ? 'YOU WIN!' : `You came ${['1st', '2nd', '3rd'][yourPlace]}`}</p>
            <div className="flex items-end justify-center gap-2 mt-2 flex-1 min-h-0">
              {[1, 0, 2].map((rank) => {
                const p = ranked[rank]
                return (
                  <motion.div key={p.id} className="flex-1 text-center" initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 + (2 - rank) * 0.25, type: 'spring', bounce: 0.5 }}>
                    <div className="text-xl">{MEDALS[rank]}</div>
                    <div className="text-2xl">{p.icon}</div>
                    <p className="num text-xs font-bold">{money(p.value).replace(/\.\d+$/, '')}</p>
                    <div className="mt-1 rounded-t-lg" style={{ height: [64, 44, 28][rank], background: p.color }} />
                  </motion.div>
                )
              })}
            </div>
            <p className="text-xs text-white/80 mt-2 leading-snug">
              {years.filter((v) => v === 'crash').length >= 3
                ? 'Lots of crashes, so safer mixes held up better.'
                : 'Mostly good years, so riskier mixes pulled ahead. Real markets never tell you which decade you get.'}
            </p>
            <div className="flex gap-2 mt-2">
              <motion.button whileTap={{ scale: 0.94 }} onClick={start} className="flex-1 rounded-xl py-2 font-bold text-[#14103A] bg-[#5FF2D0] shadow-[0_4px_0_#0E8C78]">Race again</motion.button>
              <motion.button whileTap={{ scale: 0.94 }} onClick={() => setYears(null)} className="flex-1 rounded-xl py-2 font-bold bg-white/15">Change mix</motion.button>
            </div>
          </>
        )}
      </div>

      {/* Right panel: the sky and the race track */}
      <div className="relative rounded-2xl overflow-hidden min-h-0">
        <AnimatePresence>
          <motion.div key={weather || 'start'} className="absolute inset-0" style={{ background: SKIES[weather || 'start'] }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} />
        </AnimatePresence>
        {weather === 'boom' && <Sun />}
        {(weather === 'flat' || weather === 'crash') && <Clouds dark={weather === 'crash'} />}
        {weather === 'crash' && <Rain />}
        {weather === 'crash' && <Flash id={shown} />}
        {finished && yourPlace === 0 && <Confetti />}

        <AnimatePresence mode="popLayout">
          {weather && !finished && (
            <motion.div key={shown} className={`absolute top-3 inset-x-0 mx-auto w-fit z-10 rounded-full px-4 py-1.5 font-black shadow-lg ${BANNER[weather].cls}`}
              initial={{ scale: 0.2, rotate: -8, opacity: 0 }} animate={{ scale: 1, rotate: 0, opacity: 1 }} exit={{ scale: 0.6, opacity: 0, y: -20 }}
              transition={{ type: 'spring', stiffness: 500, damping: 18 }}>
              {BANNER[weather].text}
            </motion.div>
          )}
        </AnimatePresence>

        <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
          <line x1="12" x2={W - 28} y1={y(GAME_CASH)} y2={y(GAME_CASH)} stroke="white" strokeOpacity="0.5" strokeDasharray="6 6" vectorEffect="non-scaling-stroke" />
          {paths.map((p) => (
            <path key={p.id} d={line(p.path)} fill="none" stroke={p.color} strokeWidth={p.id === 'you' ? 5 : 3.5}
              strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" style={{ filter: `drop-shadow(0 0 6px ${p.color})` }} />
          ))}
        </svg>
        {/* Runner avatars ride the tip of each line */}
        {paths.map((p) => (
          <motion.span key={p.id} className="absolute text-2xl -translate-x-1/2 -translate-y-1/2 z-10 drop-shadow"
            animate={{ left: `${(x(shown) / W) * 100}%`, top: `${(y(p.path[shown]) / H) * 100}%` }} transition={{ duration: 0.55, ease: 'easeOut' }}>
            {p.icon}
          </motion.span>
        ))}
        {!years && (
          <div className="absolute inset-0 grid place-items-center text-center px-6">
            <motion.p animate={{ y: [0, -6, 0] }} transition={{ duration: 2, repeat: Infinity }} className="text-xl font-black drop-shadow">
              🚀 🐆 🐢<br />Ready at $10,000
            </motion.p>
          </div>
        )}
      </div>
    </motion.div>
  )
}
