import { STOCKS } from '../data/stocks.js'
import { money, pct } from '../format.js'
import PriceChart from '../components/PriceChart.jsx'

const tone = (n) => (n >= 0 ? 'text-gain' : 'text-loss')

// Explore tab: every stock you can practice with.
export default function Explore({ prices, onOpen }) {
  return (
    <div className="pb-28 px-4">
      <header className="pt-6">
        <h1 className="text-2xl font-bold">Explore</h1>
        <p className="text-muted text-sm mt-1">Tap a stock to see how it moves and what its numbers mean.</p>
      </header>
      <ul className="mt-3">
        {STOCKS.map((s) => {
          const ch = prices.change(s.symbol)
          return (
            <li key={s.symbol} className="border-b border-line">
              <button onClick={() => onOpen(s.symbol)} className="w-full grid grid-cols-[1fr_60px_auto] items-center gap-4 py-3.5 text-left">
                <div className="min-w-0">
                  <div className="font-semibold tracking-wide">{s.symbol}</div>
                  <div className="text-muted text-sm truncate">{s.name}</div>
                </div>
                <PriceChart data={prices.history[s.symbol]} height={26} width={60} compact />
                <div className="text-right num">
                  <div className="font-semibold">{money(prices.price(s.symbol))}</div>
                  <div className={`text-sm ${tone(ch)}`}>{pct(ch)}</div>
                </div>
              </button>
            </li>
          )
        })}
      </ul>
      <p className="text-muted text-xs mt-4">Prices are simulated from sample data, not real market prices.</p>
    </div>
  )
}
