import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { money } from '../format.js'

// Bottom sheet for buying or selling. `mode` is 'buy' | 'sell' | null.
export default function TradePanel({ mode, symbol, price, cash, owned, onConfirm, onClose }) {
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
    setDone(`${isBuy ? 'Bought' : 'Sold'} ${shares} ${symbol} for ${money(total)}`)
    setTimeout(close, 1100)
  }
  const step = (d) => {
    setError(null)
    setShares((n) => Math.max(1, n + d))
  }

  return (
    <AnimatePresence>
      {mode && (
        <>
          <motion.div className="fixed inset-0 bg-[#0E0B24]/70 z-40" onClick={close}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
          <motion.div
            role="dialog" aria-label={isBuy ? `Buy ${symbol}` : `Sell ${symbol}`}
            className="fixed bottom-0 inset-x-0 mx-auto w-full max-w-[420px] z-50 bg-surface rounded-t-3xl px-5 pt-3 pb-8"
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-line" />
            <div className="flex items-baseline justify-between">
              <h3 className="font-display text-2xl font-bold">{isBuy ? 'Buy' : 'Sell'} {symbol}</h3>
              <button onClick={close} className="text-lilac text-sm hover:text-chalk">Cancel</button>
            </div>
            <p className="text-lilac text-sm mt-1 num">
              {money(price)} per share · {isBuy ? `${money(cash)} cash available` : `you own ${owned}`}
            </p>

            <div className="flex items-center justify-center gap-6 mt-6">
              <button onClick={() => step(-1)} className="sticker bg-line text-chalk w-12 h-12 px-0 text-2xl" aria-label="One fewer share">−</button>
              <div className="text-center min-w-[96px]">
                <div className="font-display text-5xl font-extrabold num">{shares}</div>
                <div className="text-lilac text-sm">share{shares === 1 ? '' : 's'}</div>
              </div>
              <button onClick={() => step(1)} className="sticker bg-line text-chalk w-12 h-12 px-0 text-2xl" aria-label="One more share">+</button>
            </div>

            <div className="flex justify-between mt-6 py-3 border-t border-line num">
              <span className="text-lilac">{isBuy ? 'Total cost' : 'You get'}</span>
              <span className="font-semibold">{money(total)}</span>
            </div>

            {error && <p role="alert" className="text-loss text-sm mb-3">{error}</p>}
            {done ? (
              <motion.p initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                className="text-center font-display text-lg font-bold text-gain py-3">{done} ✓</motion.p>
            ) : (
              <button onClick={confirm} className={`sticker w-full text-night text-lg ${isBuy ? 'bg-gain' : 'bg-loss'}`}>
                {isBuy ? 'Buy' : 'Sell'} {shares} share{shares === 1 ? '' : 's'}
              </button>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
