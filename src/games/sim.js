// Pure game rules (prd.md > Games), free of React so they can be checked directly.

export const GAME_CASH = 10000
export const SAVINGS_RATE = 0.03

export const SCENARIOS = {
  boom: { label: 'Boom', stocks: 0.25 },
  flat: { label: 'Flat', stocks: 0.02 },
  crash: { label: 'Crash', stocks: -0.3 },
}

/** n random market years, e.g. ['boom', 'crash', 'flat', ...]. */
export function randomYears(n = 10, rand = Math.random) {
  const kinds = ['boom', 'boom', 'flat', 'flat', 'crash'] // booms and flats are more common than crashes
  return Array.from({ length: n }, () => kinds[Math.floor(rand() * kinds.length)])
}

/** Value path for a stocks/savings mix, rebalanced each year. stockPct is 0–100. */
export function runMix(stockPct, years, start = GAME_CASH) {
  const w = stockPct / 100
  const path = [start]
  for (const y of years) {
    const prev = path[path.length - 1]
    path.push(prev * (1 + w * SCENARIOS[y].stocks + (1 - w) * SAVINGS_RATE))
  }
  return path
}

export const SECTORS = ['Tech', 'Energy', 'Health', 'Consumer']
export const CRASH_DROP = -0.5
export const OTHERS_GAIN = 0.06

/** Value after a crash hits one sector. allocation: { Tech: 4000, ... } */
export function sectorCrash(allocation, crashed) {
  return SECTORS.reduce((t, s) => t + (allocation[s] || 0) * (1 + (s === crashed ? CRASH_DROP : OTHERS_GAIN)), 0)
}

export const evenSplit = () => Object.fromEntries(SECTORS.map((s) => [s, GAME_CASH / SECTORS.length]))
