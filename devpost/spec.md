---
doc: spec
status: approved
---

# Practice Portfolio — Technical Spec

## How This Works, In Plain Language
Practice Portfolio is a single web page that runs entirely in your browser. There's no server and no account.

- **The screens** (intro, home, stock detail, trade, term explanation) are React components. Each one is a self-contained piece of the interface.
- **The stock list** is a small file of 8 well-known companies. Each has a starting price and its key numbers (market cap, P/E ratio, dividend, volatility).
- **The price simulator** nudges every price up or down a little every few seconds, so the charts and your gains move like real ones. The prices are labeled as simulated.
- **Your portfolio** (cash, the shares you own, and whether you've seen the intro) is saved in the browser's `localStorage`, a small store the browser keeps for this one site. Close the tab, come back, and it's still there.
- **The term explanations** are five small animated components, one per term, each paired with a plain-English explanation.

Why this shape: everything in the PRD happens on one person's screen, so a server or database would add work without adding anything you can see.

## The Core Journey Through the System
PRD ref: `prd.md > The Core Journey`.
1. You open the app. `App` reads `localStorage`. If there's nothing saved, it creates a portfolio with $10,000 cash and shows the **Intro**.
2. You take or skip the **Tutorial**. Either way, `hasSeenIntro: true` is saved.
3. **Home** reads cash and holdings from the portfolio store, and current prices from the price simulator. It works out each holding's value and gain or loss.
4. You tap a stock. **Stock detail** shows its price, a chart of its recent simulated prices, and its key numbers as tappable `TermLink`s.
5. You tap "P/E ratio." The **Term sheet** slides up with the explanation text and the matching animation.
6. You tap Buy and enter a number of shares. The **Trade panel** checks that the cost is no more than your cash. If it's too much, it shows an error and changes nothing. If it's fine, the store updates cash and holdings and saves them.
7. Back on **Home**, your new holding appears. Its gain or loss changes as the simulator moves prices.

## Stack
Your choices, agreed in this conversation:
- **React 18 + Vite 5:** the app and its dev server. https://react.dev, https://vite.dev
- **Tailwind CSS 3:** styling with exact colors and spacing, which serves your design-output goal. https://tailwindcss.com/docs
- **Framer Motion 11** (`framer-motion`): the mini animations and the sheet sliding up. https://www.framer.com/motion/
- **Charts:** a small hand-made SVG line chart. One simple chart doesn't need a charting library.
- **Language:** JavaScript, not TypeScript, to keep setup light.

The tradeoff you accepted: it's JavaScript rather than Python or Java.
*To verify early in the build:* the versions above are from my knowledge, not a lookup. Check them against current releases at setup, and use whatever `npm create vite@latest` installs.

## Where It Runs and How Someone Tries It
- **Needs:** Node.js 18 or newer. No API keys.
- **Start:** `npm install`, then `npm run dev`, then open http://localhost:5173.
- **Recording:** use a narrow browser window or phone-size device mode, so it reads like a trading app. To show the first-time intro, clear the site's storage first (DevTools → Application → Local Storage → clear) or use a "Reset" button in the app.
- **Submission:** a short demo video plus a public GitHub repository. Deployment is optional (Vercel is the likely choice); decide in `6-ship`.

## Look and Feel
Final direction, from a reference screenshot the learner shared during the build (a light, mint-green brokerage app; accent later changed to mint blue at the learner's request): **minimalistic but aesthetic**. It replaces the earlier navy and sticker versions.
- **Light only** (white background), matching the reference.
- **Colors** (CSS variables in `src/index.css`): text `#1C1F23`, muted `#7C7E8C`, lines `#E9ECEF`, mint-blue accent `#0BA5C4`, gains green `#00B386`, losses `#EB5B3C`, and a dark hero `#101A21` with a soft mint-blue glow.
- **Gains and losses never rely on color alone:** always ▲/▼ plus a +/− sign.
- **Type:** DM Sans with tabular numbers. Big bold portfolio value in the hero.
- **Home:** a "Portfolio" title with a small "Practice" pill, then the dark hero card (total value, gain line, an Invested | Cash split), then round outlined action tiles, then Holdings rows ("2 × $228.10") and Explore stocks rows with sparklines.
- **Stock detail:** a big price, a green or red line chart, key numbers in an outlined card, and a floating Buy/Sell pill.
- **Terms:** an accent dotted underline with ⓘ, opening a "Learn the term" sheet.
- **Motion:** sheets in response to taps, plus the term animations. No flashing or confetti.
- **Avoid:** gambling-like urgency, and extra tabs or screens copied from the reference that the PRD doesn't need (games, bottom navigation, date circles).

## Components

### App and Navigation
`App` holds the active tab (`home` | `explore` | `learn`) and renders `TabBar` (`src/components/TabBar.jsx`) when no stock is open. Screens: `Home.jsx`, `Explore.jsx`, `Learn.jsx`; going back from a stock returns to the same tab.
Holds which screen is showing: intro, home, or detail. The term sheet and trade panel are overlays. Tabs or routes aren't needed.
PRD ref: `prd.md > Screens and Layout`.

### Portfolio Store
A React context that holds `cash`, `holdings`, and `hasSeenIntro`. It loads from `localStorage` on start and saves after every change. It provides `buy(symbol, shares, price)`, `sell(...)`, `topUp(amount)`, and `reset()`. `buy` and `sell` check the rules and return an error message instead of changing anything when a trade isn't allowed.
PRD ref: `prd.md > Buying and Selling`, `prd.md > Top Up Fake Money`, `prd.md > States and Boundaries`.

### Price Simulator
A hook (`usePrices`) that starts from each stock's base price and updates every 3 seconds with a small random move. The size of the move scales with that stock's volatility. It keeps the last ~60 prices per stock for the chart. Prices aren't saved; on reload they restart from the base prices, which is fine for a proof of concept.
PRD ref: `prd.md > Stock Detail and Prices`.

### Intro and Tutorial
- **Intro:** 2–3 short full-screen cards, ending with "Take the guided tutorial" or "Skip."
- **Tutorial:** a small step list shown as a highlighted hint bar over the real screens: "Tap Apple" → "Tap Buy" → "Buy 1 share" → "Now sell it." Each step advances when the matching action happens.

PRD ref: `prd.md > Intro and Guided Tutorial`.

### Home Screen
The cash balance and the total portfolio value at the top, then your holdings (or the empty state), then "All stocks," the list of 8, plus a Top up button.
PRD ref: `prd.md > Home and Portfolio`.

### Stock Detail Screen
The name, price, change, a `PriceChart`, a key-numbers grid of `TermLink`s with their values, and Buy / Sell buttons.
PRD ref: `prd.md > Stock Detail and Prices`.

### Trade Panel
A bottom sheet with a share count stepper, the live total, and Confirm. Errors show inline in the loss color.
PRD ref: `prd.md > Buying and Selling`.

### Term Explanations (the kernel)
A `TermLink` opens the `TermSheet` with that term's title, a 2–3 sentence explanation, and its animation. There's one animation component per term:
- **Market cap:** a stack of share icons multiplies by the price into one big "company value" block.
- **P/E ratio:** the price on one side of a scale and yearly earnings on the other, with a counter for "years of earnings you pay for."
- **Volatility:** two lines side by side, one calm and one jagged, both ending at the same place.
- **Dividend:** coins drop from the company into your cash balance.
- **Unrealized gain/loss:** the value of your shares rising and falling with "not locked in until you sell," then a "Sell" tap freezes it into realized cash.

The exact visuals can be refined in the build, but each must illustrate its own idea.
PRD ref: `prd.md > Term Explanations (the kernel)`.

### Learning Extras
- `explainTrade({ mode, symbol, shares, price, cashAfter, avgCost })` in `portfolio.js` returns the plain-English lines for the "What happened?" view in `TradePanel`. The panel stays open on that view until you tap "Got it".
- The saved portfolio adds `stats: { buys, sells }` and `learnedTerms: []`. Opening a term sheet records its id.
- `earnedBadges(portfolio)` derives badges from that state; nothing about badges is stored separately. The provider compares before and after each change and shows a short notice for new badges.
- `AllocationDonut`: a hand-made SVG donut of cash plus each holding's current value.

PRD ref: `prd.md > Learning Extras`.

### Games
- `src/games/sim.js` holds the pure rules, checkable with node. **Race:** 3 stylized 15-year `ERAS` (labeled "loosely inspired by"; year 9 is always −25% and year 10 rebounds), `growYear`, `rebalance`, `pay`, `panicChoice`, `rivalPath`, `riskAdjusted`, `raceStars`, `raceBadge`. **Coins:** 6 `ROUNDS` (clue, per-sector effects, lesson), `sectorsFor` (Bonds from round 5), `playRound`, `concentration`, `allInPath`, `coinStars`.
- Each game screen is a phase state machine (race: setup → news → decide/life → reveal → panic → debrief → end; coins: allocate → storm → result, ×6, then end). Auto-play shortens the timings and picks defaults (hold / use savings / even split).
- `src/games/GameStage.jsx`: a full-screen 16:9 landscape stage. On upright phones it's rotated 90° with CSS; on touch devices it also tries `requestFullscreen()` + `screen.orientation.lock('landscape')`, which only some browsers support. `src/games/Effects.jsx` holds the shared sky, sun, clouds, rain, flash, and confetti.
- `src/screens/Games.jsx` is the game picker; `src/games/RiskReward.jsx` and `src/games/Diversify.jsx` are the games. Game state lives in memory only and isn't saved.

PRD ref: `prd.md > Games`.

## Data Model
- **`stocks.js`** (fixed file): `{ symbol, name, basePrice, marketCap, peRatio, dividendYield, volatility }` × 8, for example AAPL, MSFT, TSLA, KO, NVDA, AMZN, JNJ, DIS. These are **sample data**: realistic but rounded and not live. Labeled as such in the app.
- **Portfolio (`localStorage` key `pp:portfolio`):** `{ cash: 10000, holdings: { AAPL: { shares, avgCost } }, hasSeenIntro: false, stats: { buys, sells }, learnedTerms: [] }` (missing fields default, so older saves still load). Updated by store actions, and survives reloads.
- **Prices:** held in memory only, updated every 3 seconds, and restarted on reload.
- **Gain/loss:** computed from the current price and `avgCost`, never stored.
- **Term text:** stored in `terms.js` as `{ id, title, explanation }`.

## File Structure
```
practice-portfolio/  (project root)
├── index.html
├── package.json
├── tailwind.config.js      # color + font tokens from Look and Feel
├── src/
│   ├── main.jsx
│   ├── App.jsx             # which screen is showing, overlays
│   ├── index.css           # Tailwind + Inter import
│   ├── data/
│   │   ├── stocks.js       # 8 sample stocks (labeled sample data)
│   │   └── terms.js        # 5 term explanations
│   ├── state/
│   │   ├── PortfolioContext.jsx  # cash, holdings, buy/sell/topUp, localStorage
│   │   └── usePrices.js          # price simulator
│   ├── screens/
│   │   ├── Intro.jsx
│   │   ├── Home.jsx
│   │   └── StockDetail.jsx
│   ├── components/
│   │   ├── PriceChart.jsx
│   │   ├── TradePanel.jsx
│   │   ├── TopUp.jsx
│   │   ├── TutorialBar.jsx
│   │   ├── TermLink.jsx
│   │   └── TermSheet.jsx
│   └── animations/
│       ├── MarketCap.jsx
│       ├── PERatio.jsx
│       ├── Volatility.jsx
│       ├── Dividend.jsx
│       └── UnrealizedGain.jsx
├── devpost/                # planning docs
└── README.md
```

## External Services and Dependencies
None at runtime: no APIs, keys, or costs. The DM Sans font comes from Google Fonts and falls back to the system font when offline.

## Important Failure Modes
- **Stored data is corrupted or from an old format** → the app ignores it and starts fresh at $10,000.
- **A simulated price drifts to zero or below** → a minimum price floor.
- **Invalid trade, or a share count of 0 or less** → an inline error and the Confirm button is disabled.

## What Was Simplified and Why
- **Simulated prices** instead of live market data. Free APIs need keys, have rate limits, and go flat outside market hours. Live data would need an API key, request caching, and a fallback.
- **`localStorage`** instead of a server and database, because it's one user on one device. A real version would add accounts and a backend.
- **Fixed sample fundamentals** (P/E, market cap, and so on) instead of fetched ones. Enough to teach the terms.
- **Hand-made SVG chart** instead of a chart library, since one simple line doesn't need a dependency.

## Decisions and Open Issues
- **Learner decisions:** the React + Vite + Tailwind + Framer Motion browser app (accepting JavaScript over Python or Java), simulated prices, run locally and record, deployment optional.
- **Derived details** (the agent's, from those decisions): 8 sample stocks, a 3-second tick, $10,000 starting cash (an assumption carried from the PRD), the color values, and the animation concepts.
- **Learning unknown, "how do I get better design output from AI?":** clarified by writing exact design tokens and an "avoid" list into Look and Feel instead of adjectives. During the build, compare each screen against this section, and note where precise direction changed the result versus where the agent fell back on defaults.
- **Resolved PRD open questions:** prices are simulated; the stock list is 8 fixed stocks.
- **Open:** confirm package versions at setup.
