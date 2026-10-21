export const money = (n) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 })

// Gains/losses never rely on color alone: always an arrow and a sign.
const arrow = (n) => (n >= 0 ? '▲' : '▼')

export const pct = (n) => `${arrow(n)} ${n >= 0 ? '+' : '−'}${Math.abs(n).toFixed(2)}%`

export const signedMoney = (n) => `${arrow(n)} ${n >= 0 ? '+' : '−'}${money(Math.abs(n))}`

export function bigMoney(n) {
  if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`
  if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`
  return money(n)
}
