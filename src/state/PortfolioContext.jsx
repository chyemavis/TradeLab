import { createContext, useContext, useEffect, useState } from 'react'
import * as rules from './portfolio.js'

const Ctx = createContext(null)

function readStorage() {
  try {
    return rules.load(localStorage.getItem(rules.STORAGE_KEY))
  } catch {
    return rules.freshPortfolio()
  }
}

export function PortfolioProvider({ children }) {
  const [portfolio, setPortfolio] = useState(readStorage)

  useEffect(() => {
    try {
      localStorage.setItem(rules.STORAGE_KEY, JSON.stringify(portfolio))
    } catch {
      // Storage blocked (private mode): the app still works for this visit.
    }
  }, [portfolio])

  // Runs a rule; applies it on success, returns the error message otherwise.
  const apply = (result) => {
    if (result.error) return result.error
    setPortfolio(result.portfolio)
    return null
  }

  const value = {
    ...portfolio,
    buy: (sym, n, price) => apply(rules.buy(portfolio, sym, n, price)),
    sell: (sym, n, price) => apply(rules.sell(portfolio, sym, n, price)),
    topUp: (amount) => apply(rules.topUp(portfolio, amount)),
    markIntroSeen: () => setPortfolio((p) => ({ ...p, hasSeenIntro: true })),
    reset: () => setPortfolio(rules.freshPortfolio()),
  }
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export const usePortfolio = () => useContext(Ctx)
