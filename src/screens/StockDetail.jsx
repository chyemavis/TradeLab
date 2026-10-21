import { bySymbol, volatilityLabel } from '../data/stocks.js'
import { money, pct, bigMoney } from '../format.js'
import PriceChart from '../components/PriceChart.jsx'
import TermLink from '../components/TermLink.jsx'

export default function StockDetail({ symbol, prices, onBack, onTerm, position = null }) {
  const renderTerm = (id, label) => <TermLink id={id} onOpen={onTerm}>{label}</TermLink>
  const s = bySymbol[symbol]
  const ch = prices.change(symbol)
  const stats = [
    ['marketCap', 'Market cap', bigMoney(s.marketCap)],
    ['peRatio', 'P/E ratio', s.peRatio.toFixed(1)],
    ['volatility', 'Volatility', volatilityLabel(s.volatility)],
    ['dividend', 'Dividend', s.dividendYield ? `${s.dividendYield.toFixed(2)}%` : 'None'],
  ]

  return (
    <div className="pb-10">
      <div className="px-5 pt-6">
        <button onClick={onBack} className="text-muted text-sm mb-6">‹ Back</button>
        <div className="text-muted text-sm">{s.name}</div>
        <div className="text-4xl font-semibold num mt-1">{money(prices.price(symbol))}</div>
        <div className={`num text-sm mt-1 ${ch >= 0 ? 'text-gain' : 'text-loss'}`}>{pct(ch)} <span className="text-muted">recent</span></div>
      </div>
      <div className="mt-6">
        <PriceChart data={prices.history[symbol]} />
      </div>
      <div className="px-5 mt-8">
        <h2 className="text-muted text-xs uppercase tracking-wider mb-3">Key numbers</h2>
        <dl className="grid grid-cols-2 gap-px bg-line rounded-xl overflow-hidden">
          {stats.map(([id, label, value]) => (
            <div key={id} className="bg-surface p-4">
              <dt className="text-sm text-muted">{renderTerm(id, label)}</dt>
              <dd className="num font-medium mt-1">{value}</dd>
            </div>
          ))}
        </dl>

        <h2 className="text-muted text-xs uppercase tracking-wider mt-8 mb-3">Your position</h2>
        <div className="bg-surface rounded-xl p-4 flex items-center justify-between">
          <span className="text-sm text-muted">{renderTerm('unrealizedGain', 'Unrealized gain/loss')}</span>
          {position ? (
            <span className={`num font-medium ${position.gain >= 0 ? 'text-gain' : 'text-loss'}`}>
              {position.gain >= 0 ? '+' : ''}{money(position.gain)}
            </span>
          ) : (
            <span className="text-muted text-sm">You don't own any yet</span>
          )}
        </div>
      </div>
    </div>
  )
}
