import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useAnimationControls } from 'framer-motion'
import { money } from '../format.js'
import { useCountUp } from '../animations/useCountUp.js'
import * as g from './sim.js'
import { Flash, Confetti, Rain, Sun } from './Effects.jsx'

const LOOK = {
  Tech: { icon: '💻', color: '#7C5CFF' },
  Energy: { icon: '⚡', color: '#FF922B' },
  Health: { icon: '🩺', color: '#20C997' },
  Consumer: { icon: '🛍️', color: '#FF5D8F' },
  Bonds: { icon: '🏛️', color: '#5FD3EA' },
}
const short = (n) => money(n).replace(/\.\d+$/, '')
const pctText = (r) => `${r >= 0 ? '+' : '−'}${Math.abs(Math.round(r * 100))}%`
const STORM_MS = 2600
const noise = () => (Math.random() - 0.5) * 0.06 // hints are imperfect: ±3%

function Basket({ sector, coins, effect, phase, isNew, onAdd, onRemove, canAdd }) {
  const { icon, color } = LOOK[sector]
  const hit = phase !== 'allocate' && effect != null && effect < 0
  const lost = hit ? Math.round(coins * Math.min(1, -effect)) : 0
  const keep = coins - lost
  const boom = phase !== 'allocate' && effect >= 0.15

  return (
    <motion.div className="relative flex flex-col items-center min-h-0"
      initial={isNew ? { scale: 0, rotate: -20 } : false} animate={phase === 'result' && hit ? { x: [0, -10, 10, -6, 6, 0], scale: 1, rotate: 0 } : boom && phase === 'result' ? { y: [0, -10, 0], scale: 1, rotate: 0 } : { scale: 1, rotate: 0 }}
      transition={{ duration: 0.6, type: isNew ? 'spring' : undefined }}>
      {isNew && phase === 'allocate' && <span className="absolute -top-3 z-10 text-[10px] font-black bg-[#FFD43B] text-[#3A2A00] rounded-full px-2">NEW!</span>}
      <span className="text-2xl">{icon}</span>
      <span className="text-xs font-bold drop-shadow">{sector}</span>
      <div className="relative mt-1 w-full max-w-[84px] flex-1 min-h-[80px] rounded-b-3xl rounded-t-md border-4 flex flex-col-reverse items-center gap-[2px] p-1.5 overflow-hidden"
        style={{ borderColor: color, background: `${color}33` }}>
        <AnimatePresence>
          {Array.from({ length: coins }, (_, i) => (
            <motion.span key={i} className="w-[80%] h-2 rounded-full shrink-0 bg-gradient-to-b from-[#FFE066] to-[#F59F00] border border-[#C77700]"
              initial={{ y: -120, opacity: 0, rotate: -20 }}
              animate={phase === 'result' && i >= keep ? { y: 140, x: i % 2 ? 40 : -40, opacity: 0, rotate: 140 } : { y: 0, opacity: 1, rotate: 0 }}
              exit={{ y: -40, opacity: 0 }}
              transition={phase === 'result' && i >= keep ? { duration: 0.9, delay: 0.3 + (i - keep) * 0.05 } : { type: 'spring', stiffness: 420, damping: 20 }} />
          ))}
        </AnimatePresence>
        {boom && phase === 'result' && <motion.span className="absolute inset-0 grid place-items-center text-2xl" initial={{ scale: 0 }} animate={{ scale: [0, 1.4, 1] }}>✨</motion.span>}
      </div>
      {phase === 'result' && effect != null ? (
        <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className={`num text-xs font-black mt-1 rounded-full px-2 ${effect < 0 ? 'bg-[#FF3B5C]' : 'bg-[#20C997]'}`}>{pctText(effect)}</motion.span>
      ) : (
        <span className="num text-xs font-black mt-1 rounded-full px-2 bg-black/25">{coins} 🪙</span>
      )}
      {phase === 'allocate' && (
        <div className="flex gap-1 mt-1">
          <motion.button whileTap={{ scale: 0.8 }} onClick={onRemove} disabled={!coins} className="w-7 h-7 rounded-full bg-white/20 font-bold disabled:opacity-30" aria-label={`Less in ${sector}`}>−</motion.button>
          <motion.button whileTap={{ scale: 0.8 }} onClick={onAdd} disabled={!canAdd} className="w-7 h-7 rounded-full font-bold text-[#14103A] disabled:opacity-30" style={{ background: color }} aria-label={`More in ${sector}`}>+</motion.button>
        </div>
      )}
      {hit && phase !== 'allocate' && (
        <motion.span className="absolute top-6 text-3xl z-10" initial={{ y: -60, opacity: 0, scale: 2 }} animate={{ y: 0, opacity: 1, scale: 1 }} transition={{ delay: phase === 'storm' ? 1.6 : 0 }}>⚡</motion.span>
      )}
    </motion.div>
  )
}

function CountTo({ value }) {
  const delta = useCountUp(value - g.GAME_CASH, 1400, 300)
  return <span className={delta >= 0 ? 'text-[#5FF2D0]' : 'text-[#FF8FA3]'}>{short(g.GAME_CASH + delta)}</span>
}

const evenCoins = (round) => {
  const s = g.sectorsFor(round)
  const base = Object.fromEntries(s.map((k) => [k, Math.floor(g.COINS / s.length)]))
  let left = g.COINS - Object.values(base).reduce((a, b) => a + b, 0)
  for (const k of s) if (left-- > 0) base[k] += 1
  return base
}

// Don't Drop the Coins (prd.md > Games): 6 rounds of clue → allocate → market → lesson.
export default function Diversify() {
  const [round, setRound] = useState(0) // 0 = intro, 1..6, 7 = end
  const [phase, setPhase] = useState('allocate') // allocate | storm | result
  const [coins, setCoins] = useState({})
  const [moneyNow, setMoneyNow] = useState(g.GAME_CASH)
  const [effects, setEffects] = useState({})
  const [bondCoinsInCrash, setBondCoinsInCrash] = useState(0)
  const [history, setHistory] = useState([g.GAME_CASH])
  const [auto, setAuto] = useState(false)
  const shake = useAnimationControls()

  const sectors = round >= 1 && round <= 6 ? g.sectorsFor(round) : g.BASE_SECTORS
  const placed = sectors.reduce((t, s) => t + (coins[s] || 0), 0)
  const left = g.COINS - placed
  const conc = g.concentration(coins)
  const R = g.ROUNDS[round - 1]

  const begin = () => {
    setRound(1)
    setPhase('allocate')
    setCoins({})
    setMoneyNow(g.GAME_CASH)
    setHistory([g.GAME_CASH])
    setBondCoinsInCrash(0)
  }

  const run = () => {
    const out = g.playRound(moneyNow, coins, round, noise)
    const fx = Object.fromEntries(sectors.map((s) => [s, out.perSector[s].put ? out.perSector[s].out / out.perSector[s].put - 1 : R.fx[s]]))
    setEffects(fx)
    if (round === g.BONDS_ROUND) setBondCoinsInCrash(coins.Bonds || 0)
    setPhase('storm')
    setTimeout(() => {
      setMoneyNow(out.money)
      setHistory((h) => [...h, out.money])
      setPhase('result')
      if (Object.values(fx).some((v) => v < -0.2)) shake.start({ x: [0, -14, 12, -8, 4, 0], transition: { duration: 0.5 } })
    }, auto ? 700 : STORM_MS)
  }

  const next = () => {
    if (round === 6) return setRound(7)
    setRound(round + 1)
    setPhase('allocate')
    setEffects({})
    // Carry your split forward; a brand-new basket starts empty.
    setCoins((c) => Object.fromEntries(g.sectorsFor(round + 1).map((s) => [s, c[s] || 0])))
  }

  // Auto-play: even split, then run, then next, quickly.
  useEffect(() => {
    if (!auto || round < 1 || round > 6) return
    let id
    if (phase === 'allocate') id = setTimeout(() => (left > 0 ? setCoins(evenCoins(round)) : run()), 500)
    if (phase === 'result') id = setTimeout(next, 1400)
    return () => clearTimeout(id)
  }, [auto, round, phase, left]) // eslint-disable-line react-hooks/exhaustive-deps

  const change = (s, d) => setCoins((c) => ({ ...c, [s]: Math.min(Math.max(0, (c[s] || 0) + d), (c[s] || 0) + left) }))

  // ---------------------------------------------------------------- intro & end
  if (round === 0 || round === 7) {
    const final = moneyNow
    const stars = g.coinStars({ final, bondCoinsInCrash })
    const allIns = g.BASE_SECTORS.map((s) => [s, g.allInPath(s)]).sort((a, b) => a[1] - b[1])
    return (
      <div className="h-full grid grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] gap-3">
        <div className="relative rounded-2xl overflow-hidden p-4 flex flex-col justify-center items-center text-center"
          style={{ background: 'linear-gradient(160deg,#4C3BCF 0%,#2B7FE0 70%,#25B5D6 100%)' }}>
          {round === 7 && stars === 3 && <Confetti />}
          {round === 0 ? (
            <>
              <motion.p className="text-4xl" animate={{ y: [0, -8, 0] }} transition={{ duration: 2, repeat: Infinity }}>💻 ⚡ 🩺 🛍️</motion.p>
              <p className="text-2xl font-black mt-3">Don't drop the coins!</p>
              <p className="text-white/80 text-sm mt-1 max-w-xs">6 rounds. Each round you get a clue, place your 10 coins, and the market reacts. Your money carries over.</p>
            </>
          ) : (
            <>
              <div className="text-5xl">
                {[0, 1, 2].map((i) => (
                  <motion.span key={i} className={`inline-block ${i < stars ? '' : 'grayscale opacity-30'}`}
                    initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.3 + i * 0.3, type: 'spring', bounce: 0.6 }}>⭐</motion.span>
                ))}
              </div>
              <p className="text-white/70 text-sm mt-2">You finished with</p>
              <p className="text-5xl font-black num"><CountTo value={final} /></p>
              <svg viewBox="0 0 120 40" className="w-48 mt-2">
                <polyline points={history.map((v, i) => `${i * 20},${40 - ((v - 4000) / 12000) * 40}`).join(' ')} fill="none" stroke="#FFD43B" strokeWidth="2" />
              </svg>
              <p className="text-xs text-white/70">Your money across 6 rounds</p>
            </>
          )}
        </div>
        <div className="rounded-2xl bg-black/30 backdrop-blur p-3 flex flex-col">
          {round === 0 ? (
            <>
              <p className="text-sm text-white/80">⭐ survive · ⭐⭐ end with growth · ⭐⭐⭐ growth and balanced through the big crash</p>
              <label className="flex items-center gap-2 text-xs text-white/70 mt-3">
                <input type="checkbox" checked={auto} onChange={(e) => setAuto(e.target.checked)} /> Auto-play (fast, for demos)
              </label>
              <motion.button whileTap={{ scale: 0.93, y: 3 }} onClick={begin}
                className="mt-auto rounded-xl py-3 font-black text-lg text-[#14103A] bg-gradient-to-r from-[#FFD43B] to-[#FF922B] shadow-[0_6px_0_#B85A00]">START</motion.button>
            </>
          ) : (
            <>
              <p className="font-black">What if everything was in one basket?</p>
              <ul className="mt-2 space-y-1 text-sm num">
                {allIns.map(([s, v]) => (
                  <li key={s} className="flex justify-between"><span>{LOOK[s].icon} All in {s}</span><span className={v >= g.GAME_CASH ? 'text-[#5FF2D0]' : 'text-[#FF8FA3]'}>{short(v)}</span></li>
                ))}
              </ul>
              <p className="text-xs text-white/70 mt-2">One basket can win big or lose big. Spreading out gives you a steadier ride, and you never have to guess right.</p>
              <motion.button whileTap={{ scale: 0.93, y: 3 }} onClick={begin}
                className="mt-auto rounded-xl py-2.5 font-black text-[#14103A] bg-gradient-to-r from-[#5FF2D0] to-[#5FD3EA] shadow-[0_5px_0_#0E8C78]">PLAY AGAIN</motion.button>
            </>
          )}
        </div>
      </div>
    )
  }

  // ---------------------------------------------------------------- a round
  const crashAll = round === g.BONDS_ROUND
  const stormy = phase !== 'allocate'
  return (
    <motion.div animate={shake} className="h-full grid grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)] gap-3">
      <div className="relative rounded-2xl overflow-hidden min-h-0 p-3 pt-14 grid gap-2"
        style={{ gridTemplateColumns: `repeat(${sectors.length}, minmax(0,1fr))`, background: stormy ? 'linear-gradient(170deg,#1A0B3D 0%,#3B1466 60%,#2B2F7A 100%)' : 'linear-gradient(170deg,#4C3BCF 0%,#2B7FE0 70%,#25B5D6 100%)' }}>
        {stormy && Object.values(effects).some((v) => v < 0) && <Rain />}
        {phase === 'result' && Object.values(effects).some((v) => v >= 0.15) && <Sun />}
        {phase === 'result' && Object.values(effects).some((v) => v < -0.2) && <Flash id={round} />}
        <AnimatePresence>
          {phase === 'storm' && (
            <motion.div className="absolute top-1 z-10 text-5xl" initial={{ left: '-10%' }} animate={{ left: ['0%', '70%', '20%', '50%'] }} exit={{ opacity: 0 }}
              transition={{ duration: STORM_MS / 1000 * (auto ? 0.3 : 1), ease: 'easeInOut' }}>⛈️</motion.div>
          )}
        </AnimatePresence>
        <motion.div key={round} className="absolute top-2 inset-x-3 rounded-xl bg-white/90 text-[#14103A] px-3 py-1.5 shadow-lg z-0"
          initial={{ y: -40, opacity: 0 }} animate={{ y: phase === 'storm' ? -60 : 0, opacity: phase === 'storm' ? 0 : 1 }}>
          <p className="text-[10px] font-bold text-[#7C5CFF]">🔎 CLUE · ROUND {round} OF 6</p>
          <p className="font-bold text-sm leading-tight">{R.clue}</p>
        </motion.div>
        {sectors.map((s) => (
          <Basket key={s} sector={s} coins={coins[s] || 0} effect={effects[s]} phase={phase} isNew={s === 'Bonds' && round === g.BONDS_ROUND}
            canAdd={left > 0} onAdd={() => change(s, 1)} onRemove={() => change(s, -1)} />
        ))}
      </div>

      <div className="rounded-2xl bg-black/30 backdrop-blur p-3 flex flex-col min-h-0">
        <div className="flex justify-between text-xs text-white/60"><span>Round {round} / 6</span><span className="num">Each coin = {short(moneyNow / g.COINS)}</span></div>
        <p className="text-3xl font-black num">{short(moneyNow)}</p>

        {phase === 'allocate' && (
          <>
            <div className="flex flex-wrap gap-1 mt-1">
              {Array.from({ length: g.COINS }, (_, i) => (
                <motion.span key={i} className={`w-4 h-4 rounded-full border-2 ${i < left ? 'bg-gradient-to-b from-[#FFE066] to-[#F59F00] border-[#C77700]' : 'border-white/20'}`} animate={{ scale: i < left ? 1 : 0.7 }} />
              ))}
            </div>
            <p className="text-xs text-white/60 mt-2">Risk meter</p>
            <div className="h-2.5 bg-white/15 rounded-full overflow-hidden">
              <motion.div className="h-full rounded-full" animate={{ width: `${conc * 10}%`, background: conc >= 7 ? '#FF3B5C' : conc >= 5 ? '#FFD43B' : '#5FF2D0' }} />
            </div>
            <AnimatePresence>
              {conc >= 7 && (
                <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-xs text-[#FFB3C1] mt-1">⚠️ {conc} coins in one basket. That's a lot riding on one bet.</motion.p>
              )}
            </AnimatePresence>
            {crashAll && <p className="text-xs text-[#9FE9F7] mt-1">🏛️ Bonds just appeared: slower, steadier, and they act differently from stocks.</p>}
            <motion.button whileTap={{ scale: 0.93, y: 3 }} onClick={run} disabled={left > 0}
              className="mt-auto rounded-xl py-2.5 font-black text-[#14103A] bg-gradient-to-r from-[#FFD43B] to-[#FF922B] shadow-[0_5px_0_#B85A00] disabled:opacity-40">
              {left ? `Place ${left} more coin${left === 1 ? '' : 's'}` : 'RUN THE MARKET'}
            </motion.button>
          </>
        )}
        {phase === 'storm' && (
          <motion.p animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 0.6, repeat: Infinity }} className="m-auto font-black text-center">📰 The market is reacting…</motion.p>
        )}
        {phase === 'result' && (
          <motion.div className="flex flex-col flex-1 min-h-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
            <p className={`num text-sm font-bold ${history.at(-1) >= history.at(-2) ? 'text-[#5FF2D0]' : 'text-[#FF8FA3]'}`}>
              {history.at(-1) >= history.at(-2) ? '▲ +' : '▼ −'}{short(Math.abs(history.at(-1) - history.at(-2)))} this round
            </p>
            <p className="text-sm mt-1 leading-snug">💡 {R.lesson}</p>
            <motion.button whileTap={{ scale: 0.93, y: 3 }} onClick={next}
              className="mt-auto rounded-xl py-2.5 font-black text-[#14103A] bg-gradient-to-r from-[#5FF2D0] to-[#5FD3EA] shadow-[0_5px_0_#0E8C78]">
              {round === 6 ? 'SEE RESULTS' : 'NEXT ROUND'}
            </motion.button>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
