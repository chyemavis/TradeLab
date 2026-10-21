import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
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
  const [newBadge, setNewBadge] = useState(null)
  const earnedBefore = useRef(rules.earnedBadges(portfolio))
  // Stable so the notice's auto-dismiss timer isn't reset on every price tick.
  const dismissBadge = useCallback(() => setNewBadge(null), [])

  useEffect(() => {
    try {
      localStorage.setItem(rules.STORAGE_KEY, JSON.stringify(portfolio))
    } catch {
      // Storage blocked (private mode): the app still works for this visit.
    }
    // Announce any badge that just became earned.
    const now = rules.earnedBadges(portfolio)
    const fresh = now.find((id) => !earnedBefore.current.includes(id))
    earnedBefore.current = now
    if (fresh) setNewBadge(rules.BADGES.find((b) => b.id === fresh))
  }, [portfolio])

  // Runs a rule; applies it on success, returns the error message otherwise.
  const apply = (result) => {
    if (result.error) return result.error
    setPortfolio(result.portfolio)
    return null
  }

  const value = {
    ...portfolio,
    earned: rules.earnedBadges(portfolio),
    newBadge,
    dismissBadge,
    buy: (sym, n, price) => apply(rules.buy(portfolio, sym, n, price)),
    sell: (sym, n, price) => apply(rules.sell(portfolio, sym, n, price)),
    topUp: (amount) => apply(rules.topUp(portfolio, amount)),
    learnTerm: (id) => setPortfolio((p) => rules.learnTerm(p, id)),
    markIntroSeen: () => setPortfolio((p) => ({ ...p, hasSeenIntro: true })),
    reset: () => {
      earnedBefore.current = []
      setPortfolio(rules.freshPortfolio())
    },
  }
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export const usePortfolio = () => useContext(Ctx)
