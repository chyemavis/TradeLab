import { bySymbol, volatilityLabel } from '../data/stocks.js'
import { money, pct, bigMoney, signedMoney } from '../format.js'
import PriceChart from '../components/PriceChart.jsx'
import TermLink from '../components/TermLink.jsx'

export default function StockDetail({ symbol, prices, onBack, onTerm, position = null, actions = null }) {
  const term = (id, label) => <TermLink id={id} onOpen={onTerm}>{label}</TermLink>
  const s = bySymbol[symbol]
  const ch = prices.change(symbol)
  const stats = [
    ['marketCap', 'Market cap', bigMoney(s.marketCap)],
    ['peRatio', 'P/E ratio', s.peRatio.toFixed(1)],
    ['volatility', 'Volatility', volatilityLabel(s.volatility)],
    ['dividend', 'Dividend', s.dividendYield ? `${s.dividendYield.toFixed(2)}% a year` : 'None'],
  ]

  return (
    <div className="pb-32">
      <div className="px-5 pt-6">
        <button onClick={onBack} className="text-muted text-sm hover:text-ink">‹ All stocks</button>
        <h1 className="mt-6 text-lg font-semibold">
          {s.name} <span className="text-muted font-normal">{s.symbol}</span>
        </h1>
        <div className="text-5xl font-bold num tracking-tight mt-1">{money(prices.price(symbol))}</div>
        <div className={`num mt-1 ${ch >= 0 ? 'text-gain' : 'text-loss'}`}>
          {pct(ch)} <span className="text-muted">in the last few minutes</span>
        </div>
      </div>

      <div className="mt-6">
        <PriceChart data={prices.history[symbol]} height={190} />
      </div>

      <section className="px-5 mt-8">
        <h2 className="text-xl font-semibold">What the numbers say</h2>
        <p className="text-muted text-sm mt-1">Tap an underlined term to see what it means.</p>
        <dl className="card mt-4 px-4">
          {stats.map(([id, label, value]) => (
            <div key={id} className="flex items-center justify-between py-3.5 border-b border-line last:border-0">
              <dt>{term(id, label)}</dt>
              <dd className="num font-semibold">{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="px-5 mt-8">
        <h2 className="text-xl font-semibold">Your shares</h2>
        <div className="card flex items-center justify-between py-3.5 px-4 mt-3">
          <span>{term('unrealizedGain', 'Unrealized gain/loss')}</span>
          {position ? (
            <span className={`num font-semibold ${position.gain >= 0 ? 'text-gain' : 'text-loss'}`}>
              {signedMoney(position.gain)}
            </span>
          ) : (
            <span className="text-muted text-sm">You don't own any yet</span>
          )}
        </div>
      </section>

      {actions}
    </div>
  )
}
