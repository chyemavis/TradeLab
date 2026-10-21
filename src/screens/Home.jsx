import { STOCKS } from '../data/stocks.js'
import { money, pct } from '../format.js'

export default function Home({ prices, onOpen }) {
  return (
    <div className="px-5 pt-8 pb-10">
      <h2 className="text-muted text-xs uppercase tracking-wider mb-2">All stocks</h2>
      <ul className="divide-y divide-line">
        {STOCKS.map((s) => {
          const ch = prices.change(s.symbol)
          return (
            <li key={s.symbol}>
              <button onClick={() => onOpen(s.symbol)} className="w-full flex items-center justify-between py-4 text-left">
                <div>
                  <div className="font-semibold">{s.symbol}</div>
                  <div className="text-muted text-sm">{s.name}</div>
                </div>
                <div className="text-right num">
                  <div className="font-medium">{money(prices.price(s.symbol))}</div>
                  <div className={`text-sm ${ch >= 0 ? 'text-gain' : 'text-loss'}`}>{pct(ch)}</div>
                </div>
              </button>
            </li>
          )
        })}
      </ul>
      <p className="text-muted text-xs mt-6">Prices are simulated from sample data. Not real market prices.</p>
    </div>
  )
}
