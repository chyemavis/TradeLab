import { useState } from 'react'
import { motion } from 'framer-motion'
import RiskReward from '../games/RiskReward.jsx'
import Diversify from '../games/Diversify.jsx'
import GameStage from '../games/GameStage.jsx'

const GAMES = [
  {
    id: 'risk', title: 'Risk vs. reward', icons: '🚀 🐆 🐢', Game: RiskReward,
    blurb: 'Race a risky and a careful investor through 10 years of booms and crashes.',
    card: 'linear-gradient(135deg,#3B2D8F 0%,#1E5FBF 60%,#18A0C9 100%)',
    stage: 'linear-gradient(135deg,#1B1446 0%,#2A2A7A 100%)',
  },
  {
    id: 'diversify', title: 'Diversification challenge', icons: '💻 ⚡ 🩺 🛍️', Game: Diversify,
    blurb: 'Drop coins into sector baskets, then survive a surprise market storm.',
    card: 'linear-gradient(135deg,#FF5D8F 0%,#FF922B 100%)',
    stage: 'linear-gradient(135deg,#1A1040 0%,#3A1A5E 100%)',
  },
]

// Games tab (prd.md > Games). Games open on a full-screen landscape stage with game money.
export default function Games() {
  const [open, setOpen] = useState(null)
  const game = GAMES.find((g) => g.id === open)

  return (
    <div className="pb-28 px-4">
      <header className="pt-6">
        <h1 className="text-2xl font-bold">Games</h1>
        <p className="text-muted text-sm mt-1">Play with game money. Your practice portfolio isn't affected. Best played sideways 📱↔️</p>
      </header>
      <ul className="mt-4 space-y-3">
        {GAMES.map((g, i) => (
          <motion.li key={g.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={() => setOpen(g.id)}
              className="w-full text-left p-5 rounded-2xl text-white relative overflow-hidden shadow-lg" style={{ background: g.card }}>
              <motion.span className="absolute right-4 top-3 text-3xl" animate={{ y: [0, -6, 0] }} transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.4 }}>
                {g.icons}
              </motion.span>
              <p className="text-xl font-black mt-8">{g.title}</p>
              <p className="text-sm mt-1 text-white/85 max-w-[85%]">{g.blurb}</p>
              <span className="inline-block mt-4 text-sm font-black rounded-full px-5 py-1.5 bg-white text-[#14103A] shadow-[0_4px_0_rgba(0,0,0,0.25)]">▶ PLAY</span>
            </motion.button>
          </motion.li>
        ))}
      </ul>

      {game && (
        <GameStage title={game.title} background={game.stage} onExit={() => setOpen(null)}>
          <game.Game />
        </GameStage>
      )}
    </div>
  )
}
