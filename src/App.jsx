import { useState } from 'react'
import { usePrices } from './state/usePrices.js'
import Home from './screens/Home.jsx'
import StockDetail from './screens/StockDetail.jsx'
import TermSheet from './components/TermSheet.jsx'

export default function App() {
  const prices = usePrices()
  const [symbol, setSymbol] = useState(null) // null = home
  const [term, setTerm] = useState(null) // open term sheet id

  return (
    <div className="mx-auto max-w-[420px] min-h-screen">
      {symbol ? (
        <StockDetail symbol={symbol} prices={prices} onBack={() => setSymbol(null)} onTerm={setTerm} />
      ) : (
        <Home prices={prices} onOpen={setSymbol} />
      )}
      <TermSheet termId={term} onClose={() => setTerm(null)} />
    </div>
  )
}
