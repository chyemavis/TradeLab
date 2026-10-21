import { useState } from 'react'
import RiskReward from '../games/RiskReward.jsx'
import Diversify from '../games/Diversify.jsx'

const GAMES = [
  { id: 'risk', title: 'Risk vs. reward', blurb: 'Pick a stocks-to-savings mix and watch it ride through booms and crashes.', Game: RiskReward },
  { id: 'diversify', title: 'Diversification challenge', blurb: 'Spread your money across sectors, then survive a surprise crash.', Game: Diversify },
]

// Games tab (prd.md > Games). Uses its own game money; the practice portfolio is untouched.
export default function Games() {
  const [open, setOpen] = useState(null)
  const game = GAMES.find((g) => g.id === open)

  if (game) {
    return (
      <div className="pb-28 px-4">
        <button onClick={() => setOpen(null)} className="text-muted text-sm pt-6 hover:text-ink">‹ All games</button>
        <h1 className="text-2xl font-bold mt-3">{game.title}</h1>
        <div className="mt-3">
          <game.Game />
        </div>
      </div>
    )
  }

  return (
    <div className="pb-28 px-4">
      <header className="pt-6">
        <h1 className="text-2xl font-bold">Games</h1>
        <p className="text-muted text-sm mt-1">Quick experiments with game money. Your practice portfolio isn't affected.</p>
      </header>
      <ul className="mt-4 space-y-3">
        {GAMES.map((g, i) => (
          <li key={g.id}>
            <button onClick={() => { setOpen(g.id); window.scrollTo(0, 0) }} className={`w-full text-left p-5 rounded-2xl ${i === 0 ? 'hero' : 'card'}`}>
              <p className="text-xl font-bold">{g.title}</p>
              <p className={`text-sm mt-1 ${i === 0 ? 'text-white/70' : 'text-muted'}`}>{g.blurb}</p>
              <span className={`inline-block mt-4 text-sm font-semibold rounded-full px-4 py-1.5 ${i === 0 ? 'bg-white text-hero' : 'bg-accent text-white'}`}>Play</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
