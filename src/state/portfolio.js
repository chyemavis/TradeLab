// Pure portfolio rules, kept free of React so they can be checked directly.
// Each action returns { portfolio } on success or { error } with nothing changed.

export const STARTING_CASH = 10000
export const STORAGE_KEY = 'pp:portfolio'
export const TERM_COUNT = 5

export const freshPortfolio = () => ({
  cash: STARTING_CASH,
  holdings: {},
  hasSeenIntro: false,
  stats: { buys: 0, sells: 0 },
  learnedTerms: [],
})

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
    portfolio: {
      ...p,
      cash: round2(p.cash - cost),
      holdings: { ...p.holdings, [symbol]: { shares: total, avgCost } },
      stats: { ...p.stats, buys: p.stats.buys + 1 },
    },
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
  return {
    portfolio: { ...p, cash: round2(p.cash + shares * price), holdings, stats: { ...p.stats, sells: p.stats.sells + 1 } },
  }
}

export function topUp(p, amount) {
  if (!(amount > 0)) return { error: 'Enter an amount above $0.' }
  return { portfolio: { ...p, cash: round2(p.cash + amount) } }
}

export function learnTerm(p, id) {
  return p.learnedTerms.includes(id) ? p : { ...p, learnedTerms: [...p.learnedTerms, id] }
}

/** Plain-English "What happened?" lines for a completed trade. */
export function explainTrade({ mode, symbol, shares, price, cashAfter, avgCost }) {
  const amount = shares * price
  const s = `${shares} share${shares === 1 ? '' : 's'}`
  if (mode === 'buy') {
    const move = amount * 0.05
    return [
      `You bought ${s} of ${symbol} at ${fmt(price)} each, for ${fmt(amount)} in total.`,
      `You have ${fmt(cashAfter)} cash left.`,
      `If ${symbol} rises 5%, these shares would be worth about ${fmt(move)} more. If it falls 5%, about ${fmt(move)} less. Until you sell, that's an unrealized gain or loss.`,
    ]
  }
  const gain = shares * (price - avgCost)
  return [
    `You sold ${s} of ${symbol} at ${fmt(price)} each and got ${fmt(amount)} back as cash.`,
    `You paid about ${fmt(avgCost)} per share, so you ${gain >= 0 ? 'made' : 'lost'} ${fmt(Math.abs(gain))}.`,
    `That gain or loss is now realized: it's locked in and won't change with the price anymore.`,
  ]
}

export const BADGES = [
  { id: 'firstTrade', icon: '🛒', title: 'First trade', hint: 'Buy any stock' },
  { id: 'firstSale', icon: '💸', title: 'First sale', hint: 'Sell a stock you own' },
  { id: 'diversified', icon: '🧺', title: 'Diversified', hint: 'Own 3 different stocks at once' },
  { id: 'wordNerd', icon: '📖', title: 'Word nerd', hint: 'Open all 5 explained terms' },
]

/** Badge ids earned, derived from the portfolio (never stored separately). */
export function earnedBadges(p) {
  const earned = []
  if (p.stats.buys > 0) earned.push('firstTrade')
  if (p.stats.sells > 0) earned.push('firstSale')
  if (Object.keys(p.holdings).length >= 3) earned.push('diversified')
  if (p.learnedTerms.length >= TERM_COUNT) earned.push('wordNerd')
  return earned
}

/** Reads saved data; anything missing or malformed starts fresh. Older saves get defaults. */
export function load(raw) {
  try {
    const p = JSON.parse(raw)
    if (typeof p?.cash !== 'number' || typeof p.holdings !== 'object' || p.holdings === null) return freshPortfolio()
    const base = freshPortfolio()
    return {
      cash: p.cash,
      holdings: p.holdings,
      hasSeenIntro: !!p.hasSeenIntro,
      stats: { ...base.stats, ...(p.stats || {}) },
      learnedTerms: Array.isArray(p.learnedTerms) ? p.learnedTerms : [],
    }
  } catch {
    return freshPortfolio()
  }
}

const fmt = (n) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
