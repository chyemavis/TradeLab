// SAMPLE DATA — realistic, rounded figures. Not live market data.
// marketCap in USD; dividendYield in %; volatility = typical % move per tick-scale.
export const STOCKS = [
  { symbol: 'AAPL', name: 'Apple', basePrice: 228, marketCap: 3.45e12, peRatio: 34, dividendYield: 0.4, volatility: 0.6 },
  { symbol: 'MSFT', name: 'Microsoft', basePrice: 420, marketCap: 3.12e12, peRatio: 35, dividendYield: 0.7, volatility: 0.5 },
  { symbol: 'NVDA', name: 'NVIDIA', basePrice: 135, marketCap: 3.3e12, peRatio: 52, dividendYield: 0.03, volatility: 1.4 },
  { symbol: 'AMZN', name: 'Amazon', basePrice: 186, marketCap: 1.95e12, peRatio: 42, dividendYield: 0, volatility: 0.8 },
  { symbol: 'TSLA', name: 'Tesla', basePrice: 245, marketCap: 7.8e11, peRatio: 68, dividendYield: 0, volatility: 1.8 },
  { symbol: 'KO', name: 'Coca-Cola', basePrice: 70, marketCap: 3.0e11, peRatio: 26, dividendYield: 2.8, volatility: 0.25 },
  { symbol: 'JNJ', name: 'Johnson & Johnson', basePrice: 160, marketCap: 3.85e11, peRatio: 24, dividendYield: 3.0, volatility: 0.3 },
  { symbol: 'DIS', name: 'Disney', basePrice: 96, marketCap: 1.75e11, peRatio: 36, dividendYield: 0.9, volatility: 0.7 },
]

export const bySymbol = Object.fromEntries(STOCKS.map((s) => [s.symbol, s]))

export function volatilityLabel(v) {
  if (v < 0.4) return 'Low'
  if (v < 1) return 'Medium'
  return 'High'
}
