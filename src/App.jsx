import { useState } from 'react'
import { usePrices } from './state/usePrices.js'
import { PortfolioProvider, usePortfolio } from './state/PortfolioContext.jsx'
import Home from './screens/Home.jsx'
import StockDetail from './screens/StockDetail.jsx'
import TermSheet from './components/TermSheet.jsx'
import TradePanel from './components/TradePanel.jsx'
import TopUp from './components/TopUp.jsx'

function Screens() {
  const prices = usePrices()
  const portfolio = usePortfolio()
  const [symbol, setSymbol] = useState(null) // null = home
  const [term, setTerm] = useState(null) // open term sheet id
  const [trade, setTrade] = useState(null) // 'buy' | 'sell' | null
  const [topUpOpen, setTopUpOpen] = useState(false)

  const open = (sym) => {
    setSymbol(sym)
    window.scrollTo(0, 0)
  }
  const holding = symbol && portfolio.holdings[symbol]
  const position = holding && { gain: holding.shares * (prices.price(symbol) - holding.avgCost) }

  return (
    <div className="mx-auto max-w-[420px] min-h-screen">
      {symbol ? (
        <StockDetail
          symbol={symbol} prices={prices} onBack={() => setSymbol(null)} onTerm={setTerm} position={position}
          actions={
            <div className="fixed bottom-0 inset-x-0 mx-auto max-w-[420px] px-5 pb-6 pt-4 bg-gradient-to-t from-bg via-bg to-transparent flex gap-3 z-30">
              <button onClick={() => setTrade('buy')} className="btn flex-1 bg-gain text-white text-lg">Buy</button>
              <button onClick={() => setTrade('sell')} disabled={!holding} className="btn flex-1 bg-loss text-white text-lg">Sell</button>
            </div>
          }
        />
      ) : (
        <Home prices={prices} onOpen={open} onTopUp={() => setTopUpOpen(true)} />
      )}

      <TermSheet termId={term} onClose={() => setTerm(null)} />
      {symbol && (
        <TradePanel
          mode={trade} symbol={symbol} price={prices.price(symbol)} cash={portfolio.cash} owned={holding?.shares || 0}
          onConfirm={(n) => (trade === 'buy' ? portfolio.buy : portfolio.sell)(symbol, n, prices.price(symbol))}
          onClose={() => setTrade(null)}
        />
      )}
      <TopUp open={topUpOpen} onTopUp={portfolio.topUp} onClose={() => setTopUpOpen(false)} />
    </div>
  )
}

export default function App() {
  return (
    <PortfolioProvider>
      <Screens />
    </PortfolioProvider>
  )
}
