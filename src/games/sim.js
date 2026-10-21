// Pure game rules (prd.md > Games), free of React so they can be checked directly.

export const GAME_CASH = 10000
export const SAVINGS_RATE = 0.03

// ---------------------------------------------------------------------------
// The 15-Year Race
// ---------------------------------------------------------------------------

export const RACE_YEARS = 15
export const LIFE_EVENT_YEAR = 5 // 1-based
export const PANIC_YEAR = 9 // 1-based; always a −25% year, followed by a rebound
export const GOAL = 20000
export const CONTRIBUTION = 1000
export const CAR_REPAIR = 2000

export const PRESETS = { cautious: 30, balanced: 60, bold: 90 }

// Stylized from real market patterns: not actual historical returns.
// Each has ≥1 crash and ≥1 boom; year 9 is the −25% panic year, year 10 rebounds.
export const ERAS = [
  {
    name: 'Bubble, crash and comeback',
    note: 'Loosely inspired by the late 1990s to 2010s',
    years: [
      { r: 0.21, news: 'Internet companies are booming' },
      { r: 0.26, news: 'Everyone is talking about tech stocks' },
      { r: -0.1, news: 'Some tech companies miss their targets' },
      { r: -0.13, news: 'The tech bubble is deflating' },
      { r: 0.04, news: 'Markets are catching their breath' },
      { r: 0.11, news: 'Steady growth returns' },
      { r: 0.15, news: 'Housing prices keep climbing' },
      { r: 0.05, news: 'Banks are lending a lot of money' },
      { r: -0.25, news: 'Big banks are in trouble' },
      { r: 0.26, news: 'Governments step in to help' },
      { r: 0.15, news: 'Recovery continues' },
      { r: 0.02, news: 'A quiet year' },
      { r: 0.16, news: 'Companies report strong profits' },
      { r: 0.3, news: 'A great year for stocks' },
      { r: 0.11, news: 'The long climb continues' },
    ],
  },
  {
    name: 'Oil shock and a long recovery',
    note: 'Loosely inspired by the 1970s to 1980s',
    years: [
      { r: 0.12, news: 'The economy is humming along' },
      { r: -0.14, news: 'Oil prices jump suddenly' },
      { r: -0.18, news: 'Prices are rising everywhere' },
      { r: 0.2, news: 'The market bounces back' },
      { r: 0.05, news: 'Mixed signals from the economy' },
      { r: -0.07, news: 'Interest rates are going up' },
      { r: 0.06, news: 'Businesses adjust' },
      { r: 0.18, news: 'Inflation is finally cooling' },
      { r: -0.25, news: 'A sudden market panic' },
      { r: 0.22, news: 'Buyers rush back in' },
      { r: 0.1, news: 'Confidence is returning' },
      { r: 0.27, news: 'A boom in consumer spending' },
      { r: 0.02, news: 'A pause in the rally' },
      { r: 0.14, news: 'New industries are growing' },
      { r: 0.17, news: 'Strong finish to the decade' },
    ],
  },
  {
    name: 'Sudden shock, fast rebound',
    note: 'Loosely inspired by the 2010s to early 2020s',
    years: [
      { r: 0.13, news: 'Low interest rates help stocks' },
      { r: 0.01, news: 'A flat, nervous year' },
      { r: 0.11, news: 'Phones and apps are everywhere' },
      { r: 0.21, news: 'Tech giants keep growing' },
      { r: -0.06, news: 'Trade worries spook investors' },
      { r: 0.29, news: 'A strong rally' },
      { r: 0.16, news: 'Records keep breaking' },
      { r: 0.08, news: 'Growth slows a little' },
      { r: -0.25, news: 'A global emergency shuts businesses' },
      { r: 0.28, news: 'Markets roar back' },
      { r: -0.18, news: 'Prices and rates jump' },
      { r: 0.24, news: 'AI excitement lifts stocks' },
      { r: 0.04, news: 'A cautious year' },
      { r: 0.12, news: 'Profits hold up' },
      { r: 0.09, news: 'Steady to the finish' },
    ],
  },
]

export const pickEra = (rand = Math.random) => ERAS[Math.floor(rand() * ERAS.length)]

export const yearKind = (r) => (r >= 0.15 ? 'boom' : r <= -0.08 ? 'crash' : 'flat')

/** One year for a holder: { stocks, savings } grows by the year's stock return and the savings rate. */
export function growYear(h, r) {
  return { stocks: h.stocks * (1 + r), savings: h.savings * (1 + SAVINGS_RATE) }
}

export const total = (h) => h.stocks + h.savings

/** Moves money so `pct`% of the total is in stocks. */
export function rebalance(h, pct) {
  const t = total(h)
  return { stocks: (t * pct) / 100, savings: (t * (100 - pct)) / 100 }
}

export const startHolding = (pct, cash = GAME_CASH) => rebalance({ stocks: cash, savings: 0 }, pct)

/** A rival who keeps a fixed mix every year and never adds money. */
export function rivalPath(pct, era) {
  let h = startHolding(pct)
  const path = [total(h)]
  for (const y of era.years) {
    h = rebalance(growYear(h, y.r), pct)
    path.push(total(h))
  }
  return path
}

/**
 * Pays an expense. 'sell' takes it from stocks, 'savings' from savings
 * (falling back to stocks if savings run out).
 */
export function pay(h, amount, from) {
  if (from === 'sell') return { ...h, stocks: Math.max(0, h.stocks - amount) }
  const fromSavings = Math.min(h.savings, amount)
  return { savings: h.savings - fromSavings, stocks: Math.max(0, h.stocks - (amount - fromSavings)) }
}

/** Panic choice right after the −25% year. Returns the new holding and target pct. */
export function panicChoice(h, choice, pct) {
  if (choice === 'sell') return { h: rebalance(h, 0), pct: 0 }
  if (choice === 'buyMore') {
    const next = Math.min(100, pct + 20)
    return { h: rebalance(h, next), pct: next }
  }
  return { h, pct }
}

/** Return per unit of worst one-year drop: a simple risk-adjusted score. */
export function riskAdjusted(path) {
  const gain = path[path.length - 1] / path[0] - 1
  const worst = Math.min(0, ...path.slice(1).map((v, i) => v / path[i] - 1))
  return gain / Math.max(0.05, Math.abs(worst))
}

export function raceStars({ you, leopard, turtle, panicSold }) {
  const end = you[you.length - 1]
  return [
    { id: 'goal', label: 'Reached $20,000 or beat both rivals', got: end >= GOAL || (end > leopard.at(-1) && end > turtle.at(-1)) },
    { id: 'risk', label: 'Beat 🐆 on return per unit of risk', got: riskAdjusted(you) > riskAdjusted(leopard) },
    { id: 'calm', label: 'Never panic-sold', got: !panicSold },
  ]
}

export function raceBadge(panic) {
  if (panic === 'sell') return { icon: '😱', title: 'Panic Seller', text: 'You sold at the bottom, just before the rebound. It happens to real investors all the time.' }
  if (panic === 'buyMore') return { icon: '🦁', title: 'Bold Buyer', text: 'You bought more while prices were low. That takes nerve, and it paid off here.' }
  return { icon: '🧘', title: 'Steady Hands', text: 'You stayed calm through the drop and caught the rebound.' }
}

// ---------------------------------------------------------------------------
// Don't Drop the Coins
// ---------------------------------------------------------------------------

export const COINS = 10
export const BASE_SECTORS = ['Tech', 'Energy', 'Health', 'Consumer']
export const BONDS_ROUND = 5 // 1-based round where Bonds appears

export const ROUNDS = [
  { clue: 'New rules for tech companies are being debated', fx: { Tech: -0.4, Energy: 0.05, Health: 0.05, Consumer: 0.05 }, lesson: 'One sector got hit. Coins spread elsewhere were safe.' },
  { clue: 'A big medicine recall is in the news', fx: { Tech: 0.06, Energy: 0.04, Health: -0.35, Consumer: 0.05 }, lesson: 'Another single-sector hit. Spreading out keeps one bad headline from ruining you.' },
  { clue: 'Oil prices are spiking', fx: { Tech: 0.03, Energy: 0.3, Health: 0.03, Consumer: -0.25 }, lesson: 'One basket boomed while another fell. A spread portfolio catches some of the boom and softens the fall.' },
  { clue: 'Interest rates jump unexpectedly', fx: { Tech: -0.25, Energy: 0.04, Health: 0.06, Consumer: -0.2 }, lesson: 'Two sectors fell at once. More baskets means more protection.' },
  { clue: 'Recession fears are everywhere', fx: { Tech: -0.3, Energy: -0.3, Health: -0.25, Consumer: -0.3, Bonds: 0.04 }, lesson: 'When everything falls together, only something different, like bonds, holds up. That is why mixes include bonds.' },
  { clue: 'Recovery is underway, but tech looks overheated', fx: { Tech: -0.35, Energy: 0.15, Health: 0.1, Consumer: 0.2, Bonds: 0.03 }, lesson: 'Real markets mix good and bad news. Balance lets you ride the good parts.' },
]

export const sectorsFor = (round) => (round >= BONDS_ROUND ? [...BASE_SECTORS, 'Bonds'] : BASE_SECTORS)

/** Applies a round to `money` split as coins: { Tech: 3, ... } summing to 10. */
export function playRound(money, coins, round, noise = () => 0) {
  const fx = ROUNDS[round - 1].fx
  let next = 0
  const perSector = {}
  for (const s of sectorsFor(round)) {
    const put = (money * (coins[s] || 0)) / COINS
    const out = put * (1 + (fx[s] || 0) + noise())
    perSector[s] = { put, out }
    next += out
  }
  return { money: next, perSector }
}

/** Highest number of coins in one basket, 1–10: how concentrated you are. */
export const concentration = (coins) => Math.max(0, ...Object.values(coins))

/** Money if everything sat in one basket for all rounds (Bonds isn't available early). */
export function allInPath(sector) {
  return ROUNDS.reduce((m, r) => m * (1 + (r.fx[sector] ?? 0)), GAME_CASH)
}

export function coinStars({ final, bondCoinsInCrash }) {
  const n = final > 0 ? (final > GAME_CASH ? (bondCoinsInCrash >= 3 ? 3 : 2) : 1) : 0
  return n
}
