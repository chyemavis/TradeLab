// Pure random-walk step, kept separate from React so it can be checked directly.
export const PRICE_FLOOR = 1

export function nextPrice(price, volatility, rand = Math.random) {
  const pct = (rand() - 0.5) * 2 * volatility * 0.01 // ± volatility% max
  return Math.max(PRICE_FLOOR, +(price * (1 + pct)).toFixed(2))
}
