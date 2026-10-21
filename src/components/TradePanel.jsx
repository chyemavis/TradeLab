import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { money } from '../format.js'
import { explainTrade } from '../state/portfolio.js'

// Bottom sheet for buying or selling. `mode` is 'buy' | 'sell' | null.
// After a trade it stays open on a "What happened?" breakdown until dismissed.
export default function TradePanel({ mode, symbol, price, cash, owned, avgCost, onConfirm, onClose }) {
  const [shares, setShares] = useState(1)
  const [error, setError] = useState(null)
  const [done, setDone] = useState(null)
  const total = shares * price
  const isBuy = mode === 'buy'

  const close = () => {
    setShares(1)
    setError(null)
    setDone(null)
    onClose()
  }
  const confirm = () => {
    const err = onConfirm(shares)
    if (err) return setError(err)
    setDone({
      title: `${isBuy ? 'Bought' : 'Sold'} ${shares} ${symbol}`,
      lines: explainTrade({ mode, symbol, shares, price, avgCost, cashAfter: isBuy ? cash - total : cash + total }),
    })
  }
  const step = (d) => {
    setError(null)
    setShares((n) => Math.max(1, n + d))
  }

  return (
    <AnimatePresence>
      {mode && (
        <>
          <motion.div className="fixed inset-0 bg-black/50 z-40" onClick={close}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
          <motion.div
            role="dialog" aria-label={isBuy ? `Buy ${symbol}` : `Sell ${symbol}`}
            className="fixed bottom-0 inset-x-0 mx-auto w-full max-w-[420px] z-50 bg-surface rounded-t-3xl px-5 pt-3 pb-8"
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-line" />
            {done ? (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                <p className="text-accent text-sm font-medium">What happened?</p>
                <h3 className="text-2xl font-bold">{done.title} ✓</h3>
                <ul className="mt-4 space-y-3">
                  {done.lines.map((line) => (
                    <li key={line} className="flex gap-3 leading-relaxed">
                      <span className="mt-2 w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
                <button onClick={close} className="btn w-full mt-6 bg-accent text-white">Got it</button>
              </motion.div>
            ) : (
              <>
                <div className="flex items-baseline justify-between">
                  <h3 className="text-2xl font-bold">{isBuy ? 'Buy' : 'Sell'} {symbol}</h3>
                  <button onClick={close} className="text-muted text-sm hover:text-ink">Cancel</button>
                </div>
                <p className="text-muted text-sm mt-1 num">
                  {money(price)} per share · {isBuy ? `${money(cash)} cash available` : `you own ${owned}`}
                </p>

                <div className="flex items-center justify-center gap-6 mt-6">
                  <button onClick={() => step(-1)} className="btn bg-line text-ink w-12 h-12 px-0 text-2xl" aria-label="One fewer share">−</button>
                  <div className="text-center min-w-[96px]">
                    <div className="text-5xl font-bold num">{shares}</div>
                    <div className="text-muted text-sm">share{shares === 1 ? '' : 's'}</div>
                  </div>
                  <button onClick={() => step(1)} className="btn bg-line text-ink w-12 h-12 px-0 text-2xl" aria-label="One more share">+</button>
                </div>

                <div className="flex justify-between mt-6 py-3 border-t border-line num">
                  <span className="text-muted">{isBuy ? 'Total cost' : 'You get'}</span>
                  <span className="font-semibold">{money(total)}</span>
                </div>

                {error && <p role="alert" className="text-loss text-sm mb-3">{error}</p>}
                <button onClick={confirm} className={`btn w-full text-white text-lg ${isBuy ? 'bg-gain' : 'bg-loss'}`}>
                  {isBuy ? 'Buy' : 'Sell'} {shares} share{shares === 1 ? '' : 's'}
                </button>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
