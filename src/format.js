export const money = (n) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 })

export const pct = (n) => `${n >= 0 ? '+' : ''}${n.toFixed(2)}%`

export function bigMoney(n) {
  if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`
  if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`
  return money(n)
}
