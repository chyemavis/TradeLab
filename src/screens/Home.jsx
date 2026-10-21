import { STOCKS, bySymbol } from '../data/stocks.js'
import { money, pct, signedMoney } from '../format.js'
import PriceChart from '../components/PriceChart.jsx'
import { usePortfolio } from '../state/PortfolioContext.jsx'
import { BADGES } from '../state/portfolio.js'
import AllocationDonut from '../components/AllocationDonut.jsx'

const tone = (n) => (n >= 0 ? 'text-gain' : 'text-loss')

function ActionTile({ icon, label, onClick }) {
  return (
    <button onClick={onClick} className="card flex flex-col items-center gap-1.5 py-3 hover:bg-bg">
      <span className="w-8 h-8 rounded-full bg-accent/10 text-accent grid place-items-center text-lg leading-none">{icon}</span>
      <span className="text-sm font-medium">{label}</span>
    </button>
  )
}

export default function Home({ prices, onOpen, onTopUp, onReset }) {
  const { cash, holdings, earned } = usePortfolio()
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  const owned = Object.entries(holdings).map(([sym, h]) => {
    const price = prices.price(sym)
    const cost = h.shares * h.avgCost
    const value = h.shares * price
    return { sym, ...h, price, value, gain: value - cost, gainPct: ((value - cost) / cost) * 100 }
  })
  const invested = owned.reduce((t, o) => t + o.value, 0)
  const cost = owned.reduce((t, o) => t + o.shares * o.avgCost, 0)
  const totalGain = invested - cost

  return (
    <div className="pb-10 px-4">
      <header className="pt-6 flex items-center gap-2">
        <h1 className="text-2xl font-bold">Portfolio</h1>
        <span className="text-xs font-semibold text-practice bg-accent/10 rounded-md px-2 py-0.5">Practice</span>
      </header>

      <section className="hero mt-4 p-5">
        <p className="text-white/60 text-xs">Your practice portfolio</p>
        <div className="text-[34px] font-bold num tracking-tight mt-1">{money(cash + invested)}</div>
        {owned.length > 0 ? (
          <p className="num text-sm mt-1 text-[#5FE0C8]">
            {signedMoney(totalGain)} · {pct(cost ? (totalGain / cost) * 100 : 0)}
          </p>
        ) : (
          <p className="text-sm mt-1 text-white/60">Pretend money. Buy your first share below.</p>
        )}
        <div className="grid grid-cols-2 mt-5 pt-4 border-t border-white/10 num">
          <div>
            <p className="text-white/50 text-xs">Invested</p>
            <p className="font-semibold mt-0.5">{money(invested)}</p>
          </div>
          <div className="pl-4 border-l border-white/10">
            <p className="text-white/50 text-xs">Cash</p>
            <p className="font-semibold mt-0.5">{money(cash)}</p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-3 gap-3 mt-4">
        <ActionTile icon="+" label="Top up" onClick={onTopUp} />
        <ActionTile icon="◔" label="Allocation" onClick={() => scrollTo('allocation')} />
        <ActionTile icon="★" label="Badges" onClick={() => scrollTo('badges')} />
      </div>

      <section className="mt-7">
        <h2 className="text-lg font-semibold">Holdings</h2>
        {owned.length === 0 ? (
          <p className="text-muted text-sm mt-2 pb-4 border-b border-line">
            Nothing here yet. Pick a stock below and buy your first share. It's practice, so there's nothing to lose.
          </p>
        ) : (
          <ul className="mt-1">
            {owned.map((o) => (
              <li key={o.sym} className="border-b border-line">
                <button onClick={() => onOpen(o.sym)} className="w-full flex items-center justify-between py-3.5 text-left">
                  <div>
                    <div className="font-semibold tracking-wide">{o.sym}</div>
                    <div className="text-muted text-sm num">{o.shares} × {money(o.price)}</div>
                  </div>
                  <div className="text-right num">
                    <div className="font-semibold">{money(o.value)}</div>
                    <div className={`text-sm ${tone(o.gain)}`}>{signedMoney(o.gain)} ({pct(o.gainPct).slice(2)})</div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>


      {owned.length > 0 && (
        <section id="allocation" className="mt-7 scroll-mt-4">
          <h2 className="text-lg font-semibold">Allocation</h2>
          <p className="text-muted text-sm">How your money is split right now.</p>
          <div className="card p-4 mt-3">
            <AllocationDonut slices={[...owned.map((o) => ({ label: o.sym, value: o.value })), { label: 'Cash', value: cash }]} />
          </div>
        </section>
      )}

      <section id="badges" className="mt-7 scroll-mt-4">
        <div className="flex items-baseline justify-between">
          <h2 className="text-lg font-semibold">Badges</h2>
          <span className="text-muted text-sm num">{earned.length} of {BADGES.length}</span>
        </div>
        <ul className="grid grid-cols-2 gap-3 mt-3">
          {BADGES.map((b) => {
            const got = earned.includes(b.id)
            return (
              <li key={b.id} className={`card p-3 flex items-center gap-3 ${got ? '' : 'opacity-60'}`}>
                <span className={`w-9 h-9 rounded-full grid place-items-center shrink-0 ${got ? 'bg-accent/15' : 'bg-line grayscale'}`}>{b.icon}</span>
                <div className="min-w-0">
                  <p className="font-semibold text-sm">{b.title}</p>
                  <p className="text-muted text-xs">{got ? 'Earned' : b.hint}</p>
                </div>
              </li>
            )
          })}
        </ul>
      </section>

      <section className="mt-7">
        <h2 className="text-lg font-semibold">Explore stocks</h2>
        <ul className="mt-1">
          {STOCKS.map((s) => {
            const ch = prices.change(s.symbol)
            return (
              <li key={s.symbol} className="border-b border-line">
                <button onClick={() => onOpen(s.symbol)} className="w-full grid grid-cols-[1fr_60px_auto] items-center gap-4 py-3.5 text-left">
                  <div className="min-w-0">
                    <div className="font-semibold tracking-wide">{s.symbol}</div>
                    <div className="text-muted text-sm truncate">{bySymbol[s.symbol].name}</div>
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
        <button
          onClick={() => window.confirm('Start over with $10,000 and see the intro again? This clears your practice portfolio.') && onReset()}
          className="text-muted text-xs underline underline-offset-2 mt-3 hover:text-ink"
        >
          Reset demo
        </button>
      </section>
    </div>
  )
}
