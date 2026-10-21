import { useEffect, useState } from 'react'
import { STOCKS } from '../data/stocks.js'
import { nextPrice } from './simulate.js'

const TICK_MS = 3000
const HISTORY = 60

function seed() {
  // Pre-fill history so charts aren't empty on load.
  return Object.fromEntries(
    STOCKS.map((s) => {
      const h = [s.basePrice]
      for (let i = 1; i < HISTORY; i++) h.push(nextPrice(h[i - 1], s.volatility))
      return [s.symbol, h]
    }),
  )
}

/** Simulated prices: { history: {SYM: number[]}, price(sym), change(sym) } */
export function usePrices() {
  const [history, setHistory] = useState(seed)

  useEffect(() => {
    const id = setInterval(() => {
      setHistory((prev) =>
        Object.fromEntries(
          STOCKS.map((s) => {
            const h = prev[s.symbol]
            return [s.symbol, [...h.slice(-(HISTORY - 1)), nextPrice(h[h.length - 1], s.volatility)]]
          }),
        ),
      )
    }, TICK_MS)
    return () => clearInterval(id)
  }, [])

  const price = (sym) => history[sym][history[sym].length - 1]
  const change = (sym) => {
    const h = history[sym]
    return ((h[h.length - 1] - h[0]) / h[0]) * 100
  }
  return { history, price, change }
}
