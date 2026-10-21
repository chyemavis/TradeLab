import { STOCKS, bySymbol } from '../data/stocks.js'
import { money, pct } from '../format.js'
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

  return (
    <div className="pb-10">
      <header className="px-5 pt-8">
        <div className="flex items-center justify-between">
          <span className="font-display font-bold text-lg">Practice Portfolio</span>
          <button onClick={onTopUp} className="sticker bg-coin text-night px-3 py-1.5 text-sm">Top up</button>
        </div>
        <p className="text-lilac mt-8">Practice cash</p>
        <div className="font-display text-6xl font-extrabold num tracking-tight leading-none mt-1">{money(cash)}</div>
        {owned.length > 0 && (
          <p className="num mt-3 text-lilac">
            + {money(invested)} in stocks{' '}
            <span className={totalGain >= 0 ? 'text-gain' : 'text-loss'}>
              ({totalGain >= 0 ? '+' : ''}{money(totalGain)})
            </span>
          </p>
        )}
      </header>

      <section className="px-5 mt-10">
        <h2 className="font-display text-xl font-semibold">Your stocks</h2>
        {owned.length === 0 ? (
          <p className="text-lilac mt-2 py-4 border-b border-line">
            You don't own any stocks yet. Pick one below and buy your first share.
          </p>
        ) : (
          <ul className="mt-2">
            {owned.map((o) => (
              <li key={o.sym}>
                <button onClick={() => onOpen(o.sym)} className="w-full flex items-center justify-between py-3.5 border-b border-line text-left">
                  <div>
                    <div className="font-display font-bold text-lg leading-tight">{o.sym}</div>
                    <div className="text-lilac text-sm">{o.shares} share{o.shares === 1 ? '' : 's'} · {bySymbol[o.sym].name}</div>
                  </div>
                  <div className="text-right num">
                    <div className="font-semibold">{money(o.value)}</div>
                    <div className={`text-sm ${o.gain >= 0 ? 'text-gain' : 'text-loss'}`}>
                      {o.gain >= 0 ? '+' : ''}{money(o.gain)} ({pct(o.gainPct)})
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="px-5 mt-10">
        <h2 className="font-display text-xl font-semibold mb-1">Stocks to practice with</h2>
        <p className="text-lilac text-sm">Tap one to see how it moves and what its numbers mean.</p>
        <ul className="mt-4">
          {STOCKS.map((s) => {
            const ch = prices.change(s.symbol)
            return (
              <li key={s.symbol}>
                <button
                  onClick={() => onOpen(s.symbol)}
                  className="w-full grid grid-cols-[1fr_64px_auto] items-center gap-4 py-3.5 border-b border-line text-left"
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
