import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useAnimationControls } from 'framer-motion'
import { money } from '../format.js'
import * as g from './sim.js'
import { SKIES, Sun, Clouds, Rain, Flash, Confetti } from './Effects.jsx'

const W = 520
const H = 240
// Phase lengths in ms (prd.md > Games: ~15 s a year). Auto-play runs them much faster.
const TIMING = { news: 2000, decide: 8000, reveal: 3000, debrief: 2200 }
const FAST = 0.18
const RIVALS = [
  { id: 'leopard', icon: '🐆', label: '90% stocks', color: '#FF5D8F', pct: 90 },
  { id: 'turtle', icon: '🐢', label: '40% stocks', color: '#FFD43B', pct: 40 },
]
const YOU_COLOR = '#5FF2D0'
const BANNER = {
  boom: 'bg-[#FFD43B] text-[#3A2A00]',
  flat: 'bg-white text-[#3A4660]',
  crash: 'bg-[#FF3B5C] text-white',
}
const pctText = (r) => `${r >= 0 ? '+' : '−'}${Math.abs(Math.round(r * 100))}%`
const short = (n) => money(n).replace(/\.\d+$/, '')

function BigButton({ children, onClick, tone = 'mint', disabled, small }) {
  const tones = {
    mint: 'from-[#5FF2D0] to-[#5FD3EA] text-[#14103A] shadow-[0_5px_0_#0E8C78]',
    gold: 'from-[#FFD43B] to-[#FF922B] text-[#14103A] shadow-[0_5px_0_#B85A00]',
    red: 'from-[#FF5D8F] to-[#FF3B5C] text-white shadow-[0_5px_0_#A3123A]',
    ghost: 'from-white/15 to-white/10 text-white shadow-[0_5px_0_rgba(0,0,0,0.3)]',
  }
  return (
    <motion.button whileHover={{ scale: disabled ? 1 : 1.03 }} whileTap={{ scale: 0.93, y: 3 }} onClick={onClick} disabled={disabled}
      className={`rounded-xl font-black bg-gradient-to-r ${tones[tone]} ${small ? 'py-1.5 px-2 text-sm' : 'py-2.5 px-3'} disabled:opacity-35`}>
      {children}
    </motion.button>
  )
}

// The 15-Year Race (prd.md > Games): one decision per year, a life event, a panic moment.
export default function RiskReward() {
  const [era, setEra] = useState(null)
  const [startPct, setStartPct] = useState(60)
  const [auto, setAuto] = useState(false)
  const [year, setYear] = useState(0) // years completed
  const [phase, setPhase] = useState('setup') // setup | news | decide | life | reveal | panic | debrief | end
  const [pct, setPct] = useState(60)
  const [h, setH] = useState(null)
  const [path, setPath] = useState([])
  const [blockedUntil, setBlockedUntil] = useState(0) // no contributions through this year
  const [log, setLog] = useState([]) // per year: { add, pay }
  const [panic, setPanic] = useState(null)
  const [note, setNote] = useState('')
  const shake = useAnimationControls()
  const decided = useRef(false)

  const t = (k) => TIMING[k] * (auto ? FAST : 1)
  const current = era && year < g.RACE_YEARS ? era.years[year] : null
  const rivals = useMemo(() => (era ? RIVALS.map((r) => ({ ...r, path: g.rivalPath(r.pct, era) })) : []), [era])

  const start = () => {
    const e = g.pickEra()
    setEra(e)
    setYear(0)
    setPct(startPct)
    const h0 = g.startHolding(startPct)
    setH(h0)
    setPath([g.total(h0)])
    setBlockedUntil(0)
    setLog([])
    setPanic(null)
    setPhase('news')
  }

  // Phase clock.
  useEffect(() => {
    if (phase === 'news') {
      decided.current = false
      const id = setTimeout(() => setPhase(year + 1 === g.LIFE_EVENT_YEAR ? 'life' : 'decide'), t('news'))
      return () => clearTimeout(id)
    }
    if (phase === 'decide' && auto) {
      const id = setTimeout(() => decide('hold'), 300)
      return () => clearTimeout(id)
    }
    if (phase === 'life' && auto) {
      const id = setTimeout(() => lifeChoice('savings'), 500)
      return () => clearTimeout(id)
    }
    if (phase === 'panic' && auto) {
      const id = setTimeout(() => panicPick('hold'), 600)
      return () => clearTimeout(id)
    }
    if (phase === 'reveal') {
      const id = setTimeout(() => setPhase(year === g.PANIC_YEAR && !panic ? 'panic' : 'debrief'), t('reveal'))
      return () => clearTimeout(id)
    }
    if (phase === 'debrief') {
      const id = setTimeout(() => setPhase(year >= g.RACE_YEARS ? 'end' : 'news'), t('debrief'))
      return () => clearTimeout(id)
    }
  }, [phase, year, auto]) // eslint-disable-line react-hooks/exhaustive-deps

  // Plays the year's market move after a decision.
  const reveal = (holding, newPct, entry) => {
    const r = era.years[year].r
    const grown = g.rebalance(g.growYear(holding, r), newPct)
    setH(grown)
    setPct(newPct)
    setPath((p) => [...p, g.total(grown)])
    setLog((l) => [...l, entry])
    setYear((y) => y + 1)
    const kind = g.yearKind(r)
    setNote(
      kind === 'boom' ? `Stocks ${pctText(r)}. More stocks = more gain this year.`
        : kind === 'crash' ? `Stocks ${pctText(r)}. Savings cushioned part of the drop.`
          : `Stocks ${pctText(r)}. A quiet year; savings earned their 3%.`,
    )
    if (kind === 'crash') shake.start({ x: [0, -14, 12, -8, 5, 0], transition: { duration: 0.5 } })
    setPhase('reveal')
  }

  const decide = (choice) => {
    if (decided.current || phase !== 'decide') return
    decided.current = true
    let holding = h
    let next = pct
    let add = false
    if (choice === 'down') next = Math.max(0, pct - 10)
    if (choice === 'up') next = Math.min(100, pct + 10)
    if (choice === 'add') {
      holding = { ...h, savings: h.savings + g.CONTRIBUTION }
      add = true
    }
    reveal(g.rebalance(holding, next), next, { add, pay: null })
  }

  const lifeChoice = (choice) => {
    if (decided.current) return
    decided.current = true
    if (choice === 'skip') {
      setBlockedUntil(year + 3) // the two years after this one (1-based)
      reveal(h, pct, { add: false, pay: null, skip: true })
    } else {
      reveal(g.rebalance(g.pay(h, g.CAR_REPAIR, choice), pct), pct, { add: false, pay: choice })
    }
  }

  const panicPick = (choice) => {
    if (panic) return
    setPanic(choice)
    const { h: nh, pct: np } = g.panicChoice(h, choice, pct)
    setH(nh)
    setPct(np)
    setNote(choice === 'sell' ? 'You sold everything into savings.' : choice === 'buyMore' ? 'You moved more into stocks while prices are low.' : 'You held on.')
    setPhase('debrief')
  }

  // "If you'd never touched it": same start mix all the way, same contributions and repair bill.
  const handsOff = useMemo(() => {
    if (phase !== 'end') return null
    let hh = g.startHolding(startPct)
    const p = [g.total(hh)]
    era.years.forEach((y, i) => {
      const e = log[i] || {}
      if (e.add) hh = { ...hh, savings: hh.savings + g.CONTRIBUTION }
      if (e.pay) hh = g.pay(hh, g.CAR_REPAIR, 'savings')
      hh = g.rebalance(g.growYear(g.rebalance(hh, startPct), y.r), startPct)
      p.push(g.total(hh))
    })
    return p
  }, [phase]) // eslint-disable-line react-hooks/exhaustive-deps

  // Chart geometry.
  const lines = era ? [{ id: 'you', icon: '🚀', color: YOU_COLOR, path }, ...rivals.map((r) => ({ ...r, path: r.path.slice(0, path.length) }))] : []
  const all = [...lines.flatMap((l) => l.path), ...(handsOff || [])]
  const min = Math.min(g.GAME_CASH * 0.6, ...all)
  const max = Math.max(g.GOAL * 1.05, ...all)
  const y = (v) => H - 16 - ((v - min) / (max - min)) * (H - 36)
  const x = (i) => 12 + (i / g.RACE_YEARS) * (W - 40)
  const d = (p) => p.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ')
  const ranked = lines.map((l) => ({ ...l, value: l.path[l.path.length - 1] })).sort((a, b) => b.value - a.value)
  const weather = phase === 'reveal' || phase === 'panic' || phase === 'debrief' ? g.yearKind(era.years[year - 1].r) : null
  const youEnd = path[path.length - 1]
  const stars = phase === 'end' ? g.raceStars({ you: path, leopard: rivals[0].path, turtle: rivals[1].path, panicSold: panic === 'sell' }) : []
  const badge = phase === 'end' ? g.raceBadge(panic) : null

  // ---------------------------------------------------------------- render
  const left = () => {
    if (phase === 'setup') {
      return (
        <>
          <p className="font-black text-lg leading-tight">🎯 Beat 🐢 and 🐆, or reach $20,000</p>
          <p className="text-white/70 text-xs mt-1">15 years. One quick decision each year. Watch out for surprises.</p>
          <p className="text-xs text-white/60 mt-3">Pick your starting style</p>
          <div className="grid grid-cols-3 gap-1.5 mt-1">
            {Object.entries(g.PRESETS).map(([k, v]) => (
              <motion.button key={k} whileTap={{ scale: 0.92 }} onClick={() => setStartPct(v)}
                className={`rounded-xl py-2 text-sm font-bold capitalize ${startPct === v ? 'bg-white text-[#14103A]' : 'bg-white/10'}`}>
                {k === 'cautious' ? '🛡️' : k === 'balanced' ? '⚖️' : '🔥'} {k}
              </motion.button>
            ))}
          </div>
          <p className="text-4xl font-black num mt-2 bg-gradient-to-r from-[#5FF2D0] to-[#5FD3EA] bg-clip-text text-transparent">{startPct}% <span className="text-base">stocks</span></p>
          <input type="range" min="0" max="100" step="10" value={startPct} onChange={(e) => setStartPct(+e.target.value)} className="w-full accent-[#5FF2D0]" aria-label="Percent in stocks" />
          <label className="flex items-center gap-2 text-xs text-white/70 mt-1">
            <input type="checkbox" checked={auto} onChange={(e) => setAuto(e.target.checked)} /> Auto-play (fast, for demos)
          </label>
          <div className="mt-auto grid"><BigButton tone="gold" onClick={start}>START RACE</BigButton></div>
        </>
      )
    }
    if (phase === 'life') {
      return (
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col h-full">
          <p className="text-3xl">🚗💥</p>
          <p className="font-black text-lg leading-tight">Life happens: a $2,000 car repair</p>
          <p className="text-white/70 text-xs mt-1">How do you pay?</p>
          <div className="grid gap-1.5 mt-auto">
            <BigButton small tone="red" onClick={() => lifeChoice('sell')}>Sell stocks</BigButton>
            <BigButton small tone="mint" onClick={() => lifeChoice('savings')}>Use emergency savings</BigButton>
            <BigButton small tone="ghost" onClick={() => lifeChoice('skip')}>Skip adding money for 2 years</BigButton>
          </div>
        </motion.div>
      )
    }
    if (phase === 'panic') {
      return (
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1, x: [0, -4, 4, 0] }} className="flex flex-col h-full">
          <p className="text-3xl">📉😰</p>
          <p className="font-black text-lg leading-tight">Your stocks just dropped 25%!</p>
          <p className="text-white/70 text-xs mt-1">Everyone is panicking. What do you do?</p>
          <div className="grid gap-1.5 mt-auto">
            <BigButton small tone="red" onClick={() => panicPick('sell')}>Sell everything</BigButton>
            <BigButton small tone="ghost" onClick={() => panicPick('hold')}>Hold on</BigButton>
            <BigButton small tone="gold" onClick={() => panicPick('buyMore')}>Buy more (+20%)</BigButton>
          </div>
        </motion.div>
      )
    }
    if (phase === 'end') {
      return (
        <div className="flex flex-col h-full min-h-0">
          <p className="font-black text-lg">{ranked[0].id === 'you' ? '🏆 You win!' : '🏁 Race over'}</p>
          <ul className="mt-1 space-y-0.5">
            {stars.map((s, i) => (
              <motion.li key={s.id} className="flex items-center gap-1.5 text-xs" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.3 }}>
                <span className={`text-lg ${s.got ? '' : 'grayscale opacity-30'}`}>⭐</span>{s.label}
              </motion.li>
            ))}
          </ul>
          <motion.div className="mt-2 rounded-xl bg-white/10 p-2 flex gap-2 items-center" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.4, type: 'spring' }}>
            <span className="text-3xl">{badge.icon}</span>
            <span className="text-xs"><b className="block text-sm">Badge: {badge.title}</b>{badge.text}</span>
          </motion.div>
          <p className="text-xs text-white/80 mt-2 num">
            You: <b>{short(youEnd)}</b> · If you'd never touched it: <b>{short(handsOff.at(-1))}</b>
          </p>
          <p className="text-[11px] text-white/50">{era.name}. {era.note}; stylized, not real data.</p>
          <div className="mt-auto grid grid-cols-2 gap-2">
            <BigButton small onClick={start}>Race again</BigButton>
            <BigButton small tone="ghost" onClick={() => setPhase('setup')}>Change style</BigButton>
          </div>
        </div>
      )
    }
    // news / decide / reveal / debrief
    const blocked = year + 1 <= blockedUntil
    return (
      <>
        <div className="flex justify-between text-xs text-white/60"><span>Year {Math.min(year + (phase === 'news' || phase === 'decide' ? 1 : 0), 15)} of 15</span><span className="num">{pct}% stocks</span></div>
        <div className="h-2 bg-white/15 rounded-full mt-1 overflow-hidden">
          <motion.div className="h-full bg-gradient-to-r from-[#5FF2D0] to-[#FFD43B]" animate={{ width: `${(year / g.RACE_YEARS) * 100}%` }} />
        </div>
        <ul className="mt-2 space-y-1">
          {ranked.map((p, rank) => (
            <motion.li layout key={p.id} transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className={`flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm ${p.id === 'you' ? 'bg-white/20 ring-1 ring-[#5FF2D0]' : 'bg-white/5'}`}>
              <span className="text-xs w-3 text-white/60">{rank + 1}</span>
              <span>{p.icon}</span>
              <span className="flex-1 truncate">{p.id === 'you' ? 'You' : p.label}</span>
              <span className="num font-bold" style={{ color: p.color }}>{short(p.value)}</span>
            </motion.li>
          ))}
        </ul>
        {phase === 'decide' && (
          <div className="mt-auto">
            <p className="text-xs text-white/70 mb-1">Your move this year:</p>
            <div className="h-1.5 bg-white/15 rounded-full overflow-hidden mb-2">
              <motion.div key={year} className="h-full bg-[#FFD43B]" initial={{ width: '100%' }} animate={{ width: '0%' }}
                transition={{ duration: t('decide') / 1000, ease: 'linear' }} onAnimationComplete={() => decide('hold')} />
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              <BigButton small tone="ghost" onClick={() => decide('hold')}>Hold</BigButton>
              <BigButton small tone="ghost" onClick={() => decide('down')} disabled={pct === 0}>−10%</BigButton>
              <BigButton small tone="ghost" onClick={() => decide('up')} disabled={pct === 100}>+10%</BigButton>
              <BigButton small tone="gold" onClick={() => decide('add')} disabled={blocked}>+$1k</BigButton>
            </div>
          </div>
        )}
        {(phase === 'reveal' || phase === 'debrief') && (
          <motion.p key={`${year}-${phase}`} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-auto text-sm font-medium leading-snug">💬 {note}</motion.p>
        )}
      </>
    )
  }

  return (
    <motion.div animate={shake} className="h-full grid grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] gap-3">
      <div className="rounded-2xl bg-black/30 backdrop-blur p-3 flex flex-col min-h-0">{left()}</div>

      <div className="relative rounded-2xl overflow-hidden min-h-0">
        <AnimatePresence>
          <motion.div key={weather || 'start'} className="absolute inset-0" style={{ background: SKIES[weather || 'start'] }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} />
        </AnimatePresence>
        {weather === 'boom' && <Sun />}
        {(weather === 'flat' || weather === 'crash') && <Clouds dark={weather === 'crash'} />}
        {weather === 'crash' && <Rain />}
        {weather === 'crash' && phase === 'reveal' && <Flash id={year} />}
        {phase === 'end' && stars.filter((s) => s.got).length >= 2 && <Confetti />}

        <AnimatePresence mode="popLayout">
          {(phase === 'news' || phase === 'decide' || phase === 'life') && current && (
            <motion.div key={`n${year}`} className="absolute top-3 inset-x-3 z-10 rounded-xl px-3 py-2 bg-white/90 text-[#14103A] shadow-lg"
              initial={{ y: -40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -40, opacity: 0 }} transition={{ type: 'spring', stiffness: 400, damping: 26 }}>
              <p className="text-[10px] font-bold text-[#7C5CFF]">📰 YEAR {year + 1} NEWS</p>
              <p className="font-bold leading-tight">{current.news}</p>
            </motion.div>
          )}
          {weather && phase === 'reveal' && (
            <motion.div key={`w${year}`} className={`absolute top-3 inset-x-0 mx-auto w-fit z-10 rounded-full px-4 py-1.5 font-black shadow-lg ${BANNER[weather]}`}
              initial={{ scale: 0.2, rotate: -8, opacity: 0 }} animate={{ scale: 1, rotate: 0, opacity: 1 }} exit={{ scale: 0.6, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 18 }}>
              {weather === 'boom' ? '☀️ Boom!' : weather === 'crash' ? '⛈️ Crash!' : '☁️ Flat'} Stocks {pctText(era.years[year - 1].r)}
            </motion.div>
          )}
        </AnimatePresence>

        <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
          {era && (
            <>
              <line x1="12" x2={W - 28} y1={y(g.GOAL)} y2={y(g.GOAL)} stroke="#FFD43B" strokeOpacity="0.8" strokeDasharray="8 6" vectorEffect="non-scaling-stroke" />
              <line x1="12" x2={W - 28} y1={y(g.GAME_CASH)} y2={y(g.GAME_CASH)} stroke="white" strokeOpacity="0.35" strokeDasharray="4 6" vectorEffect="non-scaling-stroke" />
            </>
          )}
          {handsOff && (
            <motion.path d={d(handsOff)} fill="none" stroke="white" strokeWidth="2.5" strokeDasharray="6 5" vectorEffect="non-scaling-stroke"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.6, delay: 0.6 }} />
          )}
          {lines.map((l) => (
            <path key={l.id} d={d(l.path)} fill="none" stroke={l.color} strokeWidth={l.id === 'you' ? 5 : 3.5}
              strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" style={{ filter: `drop-shadow(0 0 6px ${l.color})` }} />
          ))}
        </svg>
        {era && <span className="absolute right-2 text-[10px] font-bold text-[#FFD43B]" style={{ top: `${(y(g.GOAL) / H) * 100 - 6}%` }}>🎯 $20k</span>}
        {lines.map((l) => (
          <motion.span key={l.id} className="absolute text-2xl -translate-x-1/2 -translate-y-1/2 z-10 drop-shadow"
            animate={{ left: `${(x(l.path.length - 1) / W) * 100}%`, top: `${(y(l.path[l.path.length - 1]) / H) * 100}%` }} transition={{ duration: 0.6, ease: 'easeOut' }}>
            {l.icon}
          </motion.span>
        ))}
        {handsOff && <p className="absolute bottom-2 left-3 text-[11px] bg-black/40 rounded px-2 py-0.5">- - - if you'd never touched it</p>}
        {phase === 'setup' && (
          <div className="absolute inset-0 grid place-items-center text-center px-6">
            <motion.p animate={{ y: [0, -8, 0] }} transition={{ duration: 2, repeat: Infinity }} className="text-2xl font-black drop-shadow">
              🚀 🐆 🐢<br /><span className="text-base">Everyone starts at $10,000</span>
            </motion.p>
          </div>
        )}
      </div>
    </motion.div>
  )
}
