// Pure portfolio rules, kept free of React so they can be checked directly.
// Each action returns { portfolio } on success or { error } with nothing changed.

export const STARTING_CASH = 10000
export const STORAGE_KEY = 'pp:portfolio'

export const freshPortfolio = () => ({ cash: STARTING_CASH, holdings: {}, hasSeenIntro: false })

const round2 = (n) => Math.round(n * 100) / 100

export function buy(p, symbol, shares, price) {
  if (!Number.isInteger(shares) || shares <= 0) return { error: 'Choose at least 1 share.' }
  const cost = round2(shares * price)
  if (cost > p.cash) {
    return { error: `That costs ${fmt(cost)}, but you have ${fmt(p.cash)}. Buy fewer shares or top up.` }
  }
  const prev = p.holdings[symbol] || { shares: 0, avgCost: 0 }
  const total = prev.shares + shares
  const avgCost = (prev.shares * prev.avgCost + shares * price) / total
  return {
    portfolio: { ...p, cash: round2(p.cash - cost), holdings: { ...p.holdings, [symbol]: { shares: total, avgCost } } },
  }
}

export function sell(p, symbol, shares, price) {
  if (!Number.isInteger(shares) || shares <= 0) return { error: 'Choose at least 1 share.' }
  const owned = p.holdings[symbol]?.shares || 0
  if (shares > owned) {
    return { error: owned ? `You only own ${owned} share${owned === 1 ? '' : 's'}.` : "You don't own any shares of this stock." }
  }
  const holdings = { ...p.holdings }
  if (shares === owned) delete holdings[symbol]
  else holdings[symbol] = { ...holdings[symbol], shares: owned - shares }
  return { portfolio: { ...p, cash: round2(p.cash + shares * price), holdings } }
}

export function topUp(p, amount) {
  if (!(amount > 0)) return { error: 'Enter an amount above $0.' }
  return { portfolio: { ...p, cash: round2(p.cash + amount) } }
}

/** Reads saved data; anything missing or malformed starts fresh. */
export function load(raw) {
  try {
    const p = JSON.parse(raw)
    if (typeof p?.cash !== 'number' || typeof p.holdings !== 'object' || p.holdings === null) return freshPortfolio()
    return { cash: p.cash, holdings: p.holdings, hasSeenIntro: !!p.hasSeenIntro }
  } catch {
    return freshPortfolio()
  }
}

const fmt = (n) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
