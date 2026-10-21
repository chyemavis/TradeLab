import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { money } from '../format.js'
import { GAME_CASH, SCENARIOS, randomYears, runMix } from './sim.js'

const W = 340
const H = 170
const COLORS = { you: 'var(--svg-accent)', 90: '#6C63FF', 40: '#F2A93B' }
const YEAR_STYLE = { boom: 'bg-gain/15 text-gain', flat: 'bg-line text-muted', crash: 'bg-loss/15 text-loss' }

// Risk vs. reward: your stock/savings mix vs. 90% and 40% stock mixes over the same random years.
export default function RiskReward() {
  const [pct, setPct] = useState(60)
  const [years, setYears] = useState(null) // null until the first run

  const paths = useMemo(() => {
    if (!years) return null
    return [
      { id: 'you', label: `You (${pct}% stocks)`, path: runMix(pct, years) },
      { id: 90, label: '90% stocks', path: runMix(90, years) },
      { id: 40, label: '40% stocks', path: runMix(40, years) },
    ]
  }, [years, pct])

  const all = paths ? paths.flatMap((p) => p.path) : [GAME_CASH]
  const min = Math.min(...all)
  const max = Math.max(...all)
  const y = (v) => H - 10 - ((v - min) / (max - min || 1)) * (H - 20)
  const x = (i) => (i / 10) * W
  const line = (path) => path.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ')

  return (
    <div>
      <p className="text-muted leading-relaxed">
        Choose how much of your {money(GAME_CASH).replace('.00', '')} goes into stocks. The rest sits in safe savings earning 3% a year. Then see 10 random market years play out.
      </p>

      <div className="card p-4 mt-4">
        <div className="flex justify-between text-sm">
          <span>Stocks <b className="num">{pct}%</b></span>
          <span className="text-muted">Savings <b className="num text-ink">{100 - pct}%</b></span>
        </div>
        <input type="range" min="0" max="100" step="10" value={pct} onChange={(e) => setPct(+e.target.value)}
          className="w-full mt-3 accent-[rgb(var(--accent))]" aria-label="Percent in stocks" />
        <div className="flex justify-between text-xs text-muted mt-1">
          <span>Safer</span><span>Riskier</span>
        </div>
      </div>

      <button onClick={() => setYears(randomYears(10))} className="btn w-full mt-4 bg-accent text-white">
        {years ? 'New years' : 'Run 10 years'}
      </button>

      {paths && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-5">
          <div className="flex flex-wrap gap-1">
            {years.map((yr, i) => (
              <span key={i} className={`text-[11px] font-medium rounded px-1.5 py-0.5 ${YEAR_STYLE[yr]}`}>
                Y{i + 1} {SCENARIOS[yr].label}
              </span>
            ))}
          </div>

          <svg viewBox={`0 0 ${W} ${H}`} className="w-full mt-3" role="img" aria-label="Value of each mix over 10 years">
            <line x1="0" x2={W} y1={y(GAME_CASH)} y2={y(GAME_CASH)} stroke="var(--svg-line)" strokeDasharray="4 4" />
            {paths.map((p) => (
              <motion.path key={`${p.id}-${years.join()}`} d={line(p.path)} fill="none" stroke={COLORS[p.id]}
                strokeWidth={p.id === 'you' ? 3 : 2} strokeLinejoin="round"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, ease: 'easeInOut' }} />
            ))}
          </svg>

          <ul className="card px-4 mt-3">
            {paths.map((p) => {
              const end = p.path[p.path.length - 1]
              const worst = Math.min(...p.path.slice(1).map((v, i) => v - p.path[i]))
              return (
                <li key={p.id} className="flex items-center gap-2 py-3 border-b border-line last:border-0 num">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: COLORS[p.id] }} />
                  <span className={`flex-1 ${p.id === 'you' ? 'font-semibold' : ''}`}>{p.label}</span>
                  <span className="text-right">
                    <span className="block font-semibold">{money(end)}</span>
                    <span className="block text-xs text-muted">worst year {money(worst)}</span>
                  </span>
                </li>
              )
            })}
          </ul>
          <p className="text-sm text-muted mt-3 leading-relaxed">
            More stocks usually means a bigger reward over time, but also bigger drops in crash years. That's the trade-off. Try "New years" a few times.
          </p>
        </motion.div>
      )}
    </div>
  )
}
