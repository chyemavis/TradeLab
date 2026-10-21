import { useState } from 'react'
import { usePrices } from './state/usePrices.js'
import { PortfolioProvider, usePortfolio } from './state/PortfolioContext.jsx'
import Home from './screens/Home.jsx'
import Intro from './screens/Intro.jsx'
import Explore from './screens/Explore.jsx'
import Learn from './screens/Learn.jsx'
import Games from './screens/Games.jsx'
import TabBar from './components/TabBar.jsx'
import StockDetail from './screens/StockDetail.jsx'
import TermSheet from './components/TermSheet.jsx'
import TradePanel from './components/TradePanel.jsx'
import TopUp from './components/TopUp.jsx'
import BadgeNotice from './components/BadgeNotice.jsx'
import TutorialBar, { TOUR } from './components/TutorialBar.jsx'

function Screens() {
  const prices = usePrices()
  const portfolio = usePortfolio()
  const [symbol, setSymbol] = useState(null) // null = home
  const [term, setTerm] = useState(null) // open term sheet id
  const [trade, setTrade] = useState(null) // 'buy' | 'sell' | null
  const [topUpOpen, setTopUpOpen] = useState(false)
  const [tour, setTour] = useState(null) // guided tour step index, or null when off
  const [tab, setTab] = useState('home') // 'home' | 'explore' | 'games' | 'learn'

  // Advances the tour when the user does what the current step asks.
  const tourEvent = (event) => setTour((s) => (s !== null && s < TOUR.length && TOUR[s].on === event ? s + 1 : s))

  const open = (sym) => {
    setSymbol(sym)
    window.scrollTo(0, 0)
    tourEvent('open')
  }
  const openTerm = (id) => {
    setTerm(id)
    portfolio.learnTerm(id)
  }
  const startTrade = (mode) => {
    setTrade(mode)
    tourEvent(mode === 'buy' ? 'buyOpen' : 'sellOpen')
  }
  const confirmTrade = (n) => {
    const err = (trade === 'buy' ? portfolio.buy : portfolio.sell)(symbol, n, prices.price(symbol))
    if (!err) tourEvent(trade === 'buy' ? 'bought' : 'sold')
    return err
  }
  const finishIntro = (withTour) => {
    portfolio.markIntroSeen()
    setTour(withTour ? 0 : null)
  }
  const goTab = (t) => {
    setTab(t)
    window.scrollTo(0, 0)
  }
  const resetDemo = () => {
    setSymbol(null)
    setTab('home')
    setTour(null)
    portfolio.reset()
  }

  if (!portfolio.hasSeenIntro) {
    return (
      <div className="mx-auto max-w-[420px]">
        <Intro onTour={() => finishIntro(true)} onSkip={() => finishIntro(false)} />
      </div>
    )
  }

  const holding = symbol && portfolio.holdings[symbol]
  const position = holding && { gain: holding.shares * (prices.price(symbol) - holding.avgCost) }

  return (
    <div className={`mx-auto max-w-[420px] min-h-screen ${tour !== null ? 'pt-28' : ''}`}>
      {symbol ? (
        <StockDetail
          symbol={symbol} prices={prices} onBack={() => setSymbol(null)} onTerm={openTerm} position={position}
          actions={
            <div className="fixed bottom-5 inset-x-0 mx-auto w-fit flex gap-1 p-1.5 bg-surface rounded-full border border-line shadow-[0_8px_24px_rgb(16_24_40/0.12)] z-30">
              <button onClick={() => startTrade('buy')} className="btn rounded-full bg-gain text-white px-9 py-2.5">Buy</button>
              <button onClick={() => startTrade('sell')} disabled={!holding} className="btn rounded-full bg-loss text-white px-9 py-2.5">Sell</button>
            </div>
          }
        />
      ) : (
        <>
          {tab === 'home' && <Home prices={prices} onOpen={open} onTopUp={() => setTopUpOpen(true)} />}
          {tab === 'explore' && <Explore prices={prices} onOpen={open} />}
          {tab === 'games' && <Games />}
          {tab === 'learn' && <Learn onTerm={openTerm} onReset={resetDemo} />}
          <TabBar tab={tab} onTab={goTab} />
        </>
      )}

      <TermSheet termId={term} onClose={() => setTerm(null)} />
      {symbol && (
        <TradePanel
          mode={trade} symbol={symbol} price={prices.price(symbol)} cash={portfolio.cash}
          owned={holding?.shares || 0} avgCost={holding?.avgCost || 0}
          onConfirm={confirmTrade}
          onClose={() => setTrade(null)}
        />
      )}
      <TutorialBar step={tour} onSkip={() => setTour(null)} onFinish={() => setTour(null)} />
      <BadgeNotice badge={portfolio.newBadge} onDone={portfolio.dismissBadge} />
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
