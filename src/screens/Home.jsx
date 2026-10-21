import { STOCKS } from '../data/stocks.js'
import { money, pct } from '../format.js'
import PriceChart from '../components/PriceChart.jsx'

export default function Home({ prices, onOpen, header = null }) {
  return (
    <div className="pb-10">
      {header}
      <section className="px-5 mt-8">
        <h2 className="font-display text-xl font-semibold mb-1">Stocks to practice with</h2>
        <p className="text-lilac text-sm">Tap one to see how it moves and what its numbers mean.</p>
        <ul className="mt-4">
          {STOCKS.map((s) => {
            const ch = prices.change(s.symbol)
            return (
              <li key={s.symbol}>
                <button
                  onClick={() => onOpen(s.symbol)}
                  className="w-full grid grid-cols-[1fr_64px_auto] items-center gap-4 py-3.5 border-b border-line text-left hover:bg-surface/40 rounded-sm"
                >
                  <div className="min-w-0">
                    <div className="font-display font-bold text-lg leading-tight">{s.symbol}</div>
                    <div className="text-lilac text-sm truncate">{s.name}</div>
                  </div>
                  <PriceChart data={prices.history[s.symbol]} height={28} width={64} compact />
                  <div className="text-right num">
                    <div className="font-semibold">{money(prices.price(s.symbol))}</div>
                    <div className={`text-sm ${ch >= 0 ? 'text-gain' : 'text-loss'}`}>{pct(ch)}</div>
                  </div>
                </button>
              </li>
            )
          })}
        </ul>
        <p className="text-lilac/80 text-xs mt-6">Prices are simulated from sample data, not real market prices.</p>
      </section>
    </div>
  )
}
