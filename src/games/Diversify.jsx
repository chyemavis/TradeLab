import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useAnimationControls } from 'framer-motion'
import { money } from '../format.js'
import { useCountUp } from '../animations/useCountUp.js'
import { GAME_CASH, SECTORS, CRASH_DROP, OTHERS_GAIN, sectorCrash, evenSplit } from './sim.js'
import { Flash, Confetti, Rain } from './Effects.jsx'

const STEP = 1000
const LOOK = {
  Tech: { icon: '💻', color: '#7C5CFF' },
  Energy: { icon: '⚡', color: '#FF922B' },
  Health: { icon: '🩺', color: '#20C997' },
  Consumer: { icon: '🛍️', color: '#FF5D8F' },
}
const empty = () => Object.fromEntries(SECTORS.map((s) => [s, 0]))
const short = (n) => money(n).replace(/\.\d+$/, '')

function Basket({ sector, amount, state, onAdd, onRemove, canAdd, locked }) {
  const { icon, color } = LOOK[sector]
  const coins = Math.round(amount / STEP)
  const keep = state === 'crashed' ? Math.ceil(coins / 2) : coins
  const value = state === 'crashed' ? amount * (1 + CRASH_DROP) : state === 'grew' ? amount * (1 + OTHERS_GAIN) : amount

  return (
    <motion.div className="relative flex flex-col items-center min-h-0"
      animate={state === 'crashed' ? { x: [0, -10, 10, -6, 6, 0], rotate: [0, -3, 3, 0] } : state === 'grew' ? { y: [0, -8, 0] } : {}}
      transition={{ duration: 0.6 }}>
      <motion.span className="text-3xl" animate={state === 'grew' ? { scale: [1, 1.3, 1] } : {}}>{icon}</motion.span>
      <span className="text-sm font-bold drop-shadow">{sector}</span>
      {/* The basket */}
      <div className="relative mt-1 w-full max-w-[96px] flex-1 min-h-[90px] rounded-b-3xl rounded-t-md border-4 flex flex-col-reverse items-center gap-[2px] p-1.5 overflow-hidden"
        style={{ borderColor: color, background: `${color}33` }}>
        <AnimatePresence>
          {Array.from({ length: coins }, (_, i) => (
            <motion.span key={i} className="w-[80%] h-2 rounded-full shrink-0 bg-gradient-to-b from-[#FFE066] to-[#F59F00] border border-[#C77700]"
              initial={{ y: -120, opacity: 0, rotate: -20 }}
              animate={i < keep ? { y: 0, opacity: 1, rotate: 0 } : { y: 140, x: (i % 2 ? 40 : -40), opacity: 0, rotate: 120 }}
              exit={{ y: -40, opacity: 0 }}
              transition={i < keep ? { type: 'spring', stiffness: 420, damping: 20 } : { duration: 0.9, delay: (i - keep) * 0.06 }} />
          ))}
        </AnimatePresence>
      </div>
      <span className={`num text-sm font-black mt-1 rounded-full px-2 ${state === 'crashed' ? 'bg-[#FF3B5C]' : state === 'grew' && amount ? 'bg-[#20C997]' : 'bg-black/25'}`}>
        {short(value)}
      </span>
      {!locked && (
        <div className="flex gap-1.5 mt-1.5">
          <motion.button whileTap={{ scale: 0.8 }} onClick={onRemove} disabled={!amount}
            className="w-8 h-8 rounded-full bg-white/20 font-bold disabled:opacity-30" aria-label={`Less in ${sector}`}>−</motion.button>
          <motion.button whileTap={{ scale: 0.8 }} onClick={onAdd} disabled={!canAdd}
            className="w-8 h-8 rounded-full font-bold text-[#14103A] disabled:opacity-30" style={{ background: color }} aria-label={`More in ${sector}`}>+</motion.button>
        </div>
      )}
    </motion.div>
  )
}

function CountTo({ value }) {
  const delta = useCountUp(value - GAME_CASH, 1300, 400)
  return <span className={delta >= 0 ? 'text-[#5FF2D0]' : 'text-[#FF8FA3]'}>{short(GAME_CASH + delta)}</span>
}

// Diversification challenge: fill sector baskets, then a storm strikes one at random.
export default function Diversify() {
  const [alloc, setAlloc] = useState(empty)
  const [phase, setPhase] = useState('build') // build | storm | result
  const [spot, setSpot] = useState(0)
  const [crashed, setCrashed] = useState(null)
  const shake = useAnimationControls()
  const left = GAME_CASH - SECTORS.reduce((t, s) => t + alloc[s], 0)

  useEffect(() => {
    if (phase !== 'storm') return
    const target = Math.floor(Math.random() * SECTORS.length)
    const hops = 12 + target // lands on target after a few laps
    let n = 0
    let id
    const hop = () => {
      n += 1
      setSpot(n % SECTORS.length)
      if (n < hops) id = setTimeout(hop, 90 + n * 16) // slows down like a wheel
      else {
        setCrashed(SECTORS[target])
        setPhase('result')
        shake.start({ x: [0, -16, 12, -8, 4, 0], transition: { duration: 0.55 } })
      }
    }
    id = setTimeout(hop, 300)
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
  const cloudIndex = phase === 'result' ? SECTORS.indexOf(crashed) : spot

  return (
    <motion.div animate={shake} className="h-full grid grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)] gap-3">
      {/* The market street with four baskets */}
      <div className="relative rounded-2xl overflow-hidden min-h-0 p-3 pt-16 grid grid-cols-4 gap-2"
        style={{ background: phase === 'build' ? 'linear-gradient(170deg,#4C3BCF 0%,#2B7FE0 70%,#25B5D6 100%)' : 'linear-gradient(170deg,#1A0B3D 0%,#3B1466 60%,#2B2F7A 100%)' }}>
        {phase !== 'build' && <Rain />}
        {phase === 'result' && <Flash id={crashed} />}
        {phase === 'result' && stars === 3 && <Confetti />}
        {/* Storm cloud hunting for a basket */}
        <AnimatePresence>
          {phase !== 'build' && (
            <motion.div className="absolute top-2 z-10 w-1/4 grid place-items-center" initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0, left: `${cloudIndex * 25}%` }} exit={{ opacity: 0 }} transition={{ type: 'spring', stiffness: 260, damping: 24 }}>
              <span className="text-5xl drop-shadow-lg">⛈️</span>
              {phase === 'result' && (
                <motion.span className="text-4xl -mt-2" initial={{ scaleY: 0, opacity: 0 }} animate={{ scaleY: [0, 1.4, 1], opacity: [0, 1, 1] }} style={{ originY: 0 }}>⚡</motion.span>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        {SECTORS.map((s) => (
          <Basket key={s} sector={s} amount={alloc[s]} locked={phase !== 'build'} canAdd={left > 0}
            state={phase === 'result' ? (s === crashed ? 'crashed' : 'grew') : null}
            onAdd={() => change(s, STEP)} onRemove={() => change(s, -STEP)} />
        ))}
      </div>

      {/* Side panel */}
      <div className="rounded-2xl bg-black/25 backdrop-blur p-3 flex flex-col min-h-0">
        {phase === 'build' && (
          <>
            <p className="text-white/80 text-sm leading-snug">Drop your 10 coins ($1,000 each) into the baskets. A storm will hit one sector. You won't know which.</p>
            <div className="flex flex-wrap gap-1 mt-3">
              {Array.from({ length: GAME_CASH / STEP }, (_, i) => (
                <motion.span key={i} className={`w-5 h-5 rounded-full border-2 ${i < left / STEP ? 'bg-gradient-to-b from-[#FFE066] to-[#F59F00] border-[#C77700]' : 'border-white/20'}`}
                  animate={i < left / STEP ? { scale: 1 } : { scale: 0.7 }} />
              ))}
            </div>
            <p className="text-sm mt-2 num">{left ? `${left / STEP} coins left` : 'All coins placed!'}</p>
            <motion.button whileHover={{ scale: left ? 1 : 1.03 }} whileTap={{ scale: 0.94 }} onClick={() => setPhase('storm')} disabled={left > 0}
              className="mt-auto rounded-xl py-3 font-black text-lg text-[#14103A] bg-gradient-to-r from-[#FFD43B] to-[#FF922B] shadow-[0_6px_0_#B85A00] disabled:opacity-40">
              RUN THE MARKET
            </motion.button>
          </>
        )}
        {phase === 'storm' && (
          <div className="flex-1 grid place-items-center text-center">
            <motion.p animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 0.6, repeat: Infinity }} className="font-black text-lg">
              📰 Breaking news…<br /><span className="text-sm font-medium text-white/70">A storm is rolling over the market</span>
            </motion.p>
          </div>
        )}
        {phase === 'result' && (
          <motion.div className="flex flex-col h-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            <p className="font-black text-lg leading-tight">⚡ {crashed} crashed {Math.abs(CRASH_DROP * 100)}%!</p>
            <p className="text-white/70 text-xs">Other sectors gained {OTHERS_GAIN * 100}%.</p>
            <div className="text-3xl mt-2">
              {[0, 1, 2].map((i) => (
                <motion.span key={i} className={`inline-block ${i < stars ? '' : 'grayscale opacity-30'}`}
                  initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.9 + i * 0.25, type: 'spring', bounce: 0.6 }}>⭐</motion.span>
              ))}
            </div>
            <p className="text-3xl font-black num mt-1"><CountTo value={yours} /></p>
            <p className="text-xs text-white/70 mt-1 num">All-in on {crashed}: {short(sectorCrash({ [crashed]: GAME_CASH }, crashed))} · Even split: {short(sectorCrash(evenSplit(), crashed))}</p>
            <p className="text-sm mt-2 leading-snug">
              {alloc[crashed] > GAME_CASH / 2
                ? `Most of your coins were in ${crashed}, so one storm hit hard. Spreading out limits the damage.`
                : alloc[crashed] === 0
                  ? `Lucky dodge! But you couldn't know where the storm would hit. Spreading out protects you either way.`
                  : 'Your coins were spread out, so the storm only hurt part of them. That is diversification.'}
            </p>
            <motion.button whileTap={{ scale: 0.94 }} onClick={reset}
              className="mt-auto rounded-xl py-2.5 font-black text-[#14103A] bg-gradient-to-r from-[#5FF2D0] to-[#5FD3EA] shadow-[0_5px_0_#0E8C78]">
              PLAY AGAIN
            </motion.button>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
