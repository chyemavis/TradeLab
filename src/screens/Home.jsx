import { STOCKS, bySymbol } from '../data/stocks.js'
import { money, pct, signedMoney } from '../format.js'
import PriceChart from '../components/PriceChart.jsx'
import { usePortfolio } from '../state/PortfolioContext.jsx'

export default function Home({ prices, onOpen, onTopUp }) {
  const { cash, holdings } = usePortfolio()
  const owned = Object.entries(holdings).map(([sym, h]) => {
    const value = h.shares * prices.price(sym)
    const gain = value - h.shares * h.avgCost
    return { sym, ...h, value, gain, gainPct: (gain / (h.shares * h.avgCost)) * 100 }
  })
  const invested = owned.reduce((t, o) => t + o.value, 0)
  const totalGain = owned.reduce((t, o) => t + o.gain, 0)
  const tone = (n) => (n >= 0 ? 'text-gain' : 'text-loss')

  return (
    <div className="pb-10">
      <header className="px-5 pt-6 flex items-center justify-between">
        <span className="font-bold text-lg">Practice Portfolio</span>
        <span className="text-xs font-semibold text-practice bg-practice/10 ring-1 ring-practice/30 rounded-full px-2.5 py-1">
          Practice mode · pretend money
        </span>
      </header>

      <section className="card mx-5 mt-6 p-5">
        <p className="text-muted text-sm">Total portfolio value</p>
        <div className="text-5xl font-bold num tracking-tight mt-1">{money(cash + invested)}</div>
        {owned.length > 0 && <p className={`num text-sm mt-2 ${tone(totalGain)}`}>{signedMoney(totalGain)} on your stocks</p>}
        <div className="grid grid-cols-2 gap-4 mt-5 pt-4 border-t border-line num">
          <div>
            <p className="text-muted text-xs">Cash</p>
            <p className="font-semibold">{money(cash)}</p>
          </div>
          <div>
            <p className="text-muted text-xs">In stocks</p>
            <p className="font-semibold">{money(invested)}</p>
          </div>
        </div>
        <button onClick={onTopUp} className="btn w-full mt-5 bg-accent/10 text-accent py-2.5">Top up practice cash</button>
      </section>

      <section className="px-5 mt-8">
        <h2 className="text-lg font-semibold">Your stocks</h2>
        {owned.length === 0 ? (
          <p className="card text-muted mt-3 p-4">
            You don't own any stocks yet. Pick one below and buy your first share. It's practice, so there's nothing to lose.
          </p>
        ) : (
          <ul className="card mt-3 px-4">
            {owned.map((o) => (
              <li key={o.sym} className="border-b border-line last:border-0">
                <button onClick={() => onOpen(o.sym)} className="w-full flex items-center justify-between py-3.5 text-left">
                  <div>
                    <div className="font-semibold">{o.sym}</div>
                    <div className="text-muted text-sm">{o.shares} share{o.shares === 1 ? '' : 's'} · {bySymbol[o.sym].name}</div>
                  </div>
                  <div className="text-right num">
                    <div className="font-semibold">{money(o.value)}</div>
                    <div className={`text-sm ${tone(o.gain)}`}>{pct(o.gainPct)}</div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="px-5 mt-8">
        <h2 className="text-lg font-semibold">Stocks to practice with</h2>
        <p className="text-muted text-sm">Tap one to see how it moves and what its numbers mean.</p>
        <ul className="card mt-3 px-4">
          {STOCKS.map((s) => {
            const ch = prices.change(s.symbol)
            return (
              <li key={s.symbol} className="border-b border-line last:border-0">
                <button onClick={() => onOpen(s.symbol)} className="w-full grid grid-cols-[1fr_64px_auto] items-center gap-4 py-3.5 text-left">
                  <div className="min-w-0">
                    <div className="font-semibold">{s.symbol}</div>
                    <div className="text-muted text-sm truncate">{s.name}</div>
                  </div>
                  <PriceChart data={prices.history[s.symbol]} height={28} width={64} compact />
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
      </section>
    </div>
  )
}
