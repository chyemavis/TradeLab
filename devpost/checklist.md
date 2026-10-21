---
doc: checklist
status: approved
---

# Build Checklist

Build mode: fast

## Slices

- [x] **1. You can browse stocks with live-moving prices and open one**
  Becomes usable: A dark, phone-width app showing the 8 sample stocks with prices that tick every 3 seconds. Tapping one opens its detail screen with a moving chart and its key numbers.
  Why now: Sets up the project and the Look and Feel tokens right away, so every later slice lands on the real design. It also proves the price simulator, which the trading and gain/loss behavior depend on.
  PRD ref: `prd.md > Stock Detail and Prices`, `prd.md > Screens and Layout`
  Spec ref: `spec.md > Stack`, `spec.md > Look and Feel`, `spec.md > Price Simulator`, `spec.md > Stock Detail Screen`, `spec.md > Data Model`, `spec.md > File Structure`
  Build: Scaffold Vite + React, install Tailwind and Framer Motion, add the color/font tokens, `stocks.js` (labeled sample data), `usePrices`, a simple Home stock list, StockDetail with the SVG `PriceChart` and key-number grid, and screen switching in `App`.
  Verify (mechanical): `npm run build` succeeds; the dev server starts with no errors; the served page loads; check the simulator logic (prices change, stay above the floor).
  Learner check: Open http://localhost:5173. Watch the prices move for a few seconds, tap a stock, and say whether it looks and feels like the minimal dark trading app you pictured.
  Commit: `Scaffold app with sample stocks, simulated prices and detail screen`

- [x] **2. You can tap a confusing term and see it explained with an animation**
  Becomes usable: On a stock's detail screen, the five terms are tappable. Each opens a sheet with a plain-English explanation and its own mini animation, plus a replay button.
  Why now: This is the kernel, so it comes before trading. If the animations don't work as explanations, we find out while there's still time to change them.
  PRD ref: `prd.md > Term Explanations (the kernel)`
  Spec ref: `spec.md > Term Explanations (the kernel)`, `spec.md > Look and Feel`
  Build: `terms.js`, `TermLink`, `TermSheet`, and the five animation components (MarketCap, PERatio, Volatility, Dividend, UnrealizedGain).
  Verify (mechanical): `npm run build` succeeds; each of the five term ids maps to an explanation and an animation component; no console errors on the dev server.
  Learner check: Open a stock and tap each of the five terms. For each one, does the animation actually help you understand the idea?
  Commit: `Add animated term explanations`

- [x] **3. You can buy and sell with fake cash, and it's still there tomorrow**
  Becomes usable: Home shows your $10,000 balance and holdings with live gain/loss. You can buy or sell from a stock's screen and top up cash. Invalid trades show an error. Everything survives a reload.
  Why now: Builds the core loop on top of the working prices and the kernel. It's also the first place saved data can go wrong.
  PRD ref: `prd.md > Buying and Selling`, `prd.md > Home and Portfolio`, `prd.md > Top Up Fake Money`, `prd.md > States and Boundaries`
  Spec ref: `spec.md > Portfolio Store`, `spec.md > Trade Panel`, `spec.md > Home Screen`, `spec.md > Data Model`, `spec.md > Important Failure Modes`
  Build: `PortfolioContext` with buy/sell/topUp/reset and localStorage, the `TradePanel` sheet, Home balance + holdings + empty state, `TopUp`, and handling for corrupted saved data.
  Verify (mechanical): `npm run build` succeeds; a node check of the buy/sell rules (an over-budget buy is rejected, an oversell is rejected, a valid trade updates cash and holdings); the dev server has no errors.
  Learner check: Buy 2 shares of something, sell 1, then try to buy far more than you can afford. Reload the page and confirm your cash and shares are still there.
  Commit: `Add buy/sell, portfolio, top-up and persistence`

- [x] **4. Learning extras: what happened, badges, and allocation**
  Becomes usable: After each trade, a "What happened?" breakdown explains it in plain numbers. Achievement badges (first trade, first sale, three different stocks, all five terms learned) unlock with a calm notice and show on Home. An allocation donut shows how your money is split.
  Why now: The learner asked for these at the checkpoint after seeing the trading flow. They build directly on slice 3's portfolio.
  PRD ref: `prd.md > Learning Extras`
  Spec ref: `spec.md > Learning Extras`, `spec.md > Data Model`
  Build: `explainTrade` and `earnedBadges` rules in `portfolio.js`; track buys, sells, and learned terms in the saved portfolio; "What happened?" view in `TradePanel`; `Badges` and `AllocationDonut` on Home; badge notice.
  Verify (mechanical): `npm run build` succeeds; a node check of `explainTrade` and `earnedBadges`; old saved data still loads; the dev server compiles CSS with no errors.
  Learner check: Buy a stock and read the breakdown, sell it, open all five terms, and buy three different stocks. Check that the badges unlock and the donut shows your split.
  Commit: `Add trade breakdown, badges and allocation donut`

- [x] **5. First-time visitors get an intro and an optional guided tutorial**
  Becomes usable: A fresh visit shows 2–3 intro cards, then Tutorial or Skip. The tutorial's hint bar walks you through a buy and a sell on the real screens and doesn't come back after it's done.
  Why now: The tutorial guides people through the real trading flow, so that flow has to exist first.
  PRD ref: `prd.md > Intro and Guided Tutorial`
  Spec ref: `spec.md > Intro and Tutorial`
  Build: `Intro` screen, `TutorialBar` with steps that advance on real actions, the `hasSeenIntro` flag, and a small "Reset demo" control for recording.
  Verify (mechanical): `npm run build` succeeds; the dev server has no errors; the tutorial steps match the actual action events.
  Learner check: Click Reset demo (or clear site data), reload, go through the intro, take the tutorial to the end, then reload and confirm the intro doesn't come back.
  Commit: `Add intro and guided tutorial`

## Hands-on Checkpoints

- [x] Early usable behavior explored — after slice 2 (prices plus the kernel animations), while the design and animations can still change. Feedback led to three restyles (playful, then calm navy, then a light brokerage look in mint blue) and the Learning extras slice.
- [ ] Final kick-the-tires exploration and feedback completed

## Final Review

- [x] Split into bottom tabs: Home, Explore, Learn — learner: "it should not be all info in one screen"; tab grouping chosen by the agent at the learner's request
- [x] Moved Top up into the dark portfolio card as a button; removed the Top up / Explore / Learn tiles from Home (redundant with the tab bar) — learner request
- [x] Games tab with Risk vs. reward and Diversification challenge — learner-designed games added at final review (`prd.md > Games`)
- [x] Made both games animated and game-like (year-by-year race with weather banners, crash shake and podium; coin baskets with a spotlight spin, lightning strike, live total and star rating) — learner: "more animation like, like a real game"
- [x] Games open on a full-screen landscape stage (rotated on upright phones; fullscreen + landscape lock where supported) with colorful weather skies, runner avatars, storm cloud, lightning flash, coin physics and confetti — learner: "flipped to horizontal mode", "more animations and colours"
- [ ] Final review complete — feedback resolved and learner confirms ready to ship

## Code Tour and App Map

- [ ] Learning activity complete — guided route, focused alternative, prior practice connected, or brief recap
- [ ] Optional edit and transfer reflection addressed — offered/declined/already covered/not applicable as appropriate
- [ ] `devpost/app-map.html` generated from finished code, checked, and shown, including a project-grounded practice to reuse

Activity and evidence:
Route and stops:
Edit outcome:
Reflection:
Activity mode:

## Revisions

- Restyled to a playful dark "sticker" look (indigo, coin yellow, Bricolage Grotesque, Figtree) — at the early checkpoint the learner found the first look too basic and asked for more playful styling; `spec.md > Look and Feel` updated.
- Replaced the playful sticker look with the learner's "calm, confident, clear" fintech brief (navy plus light mode, teal accent, DM Sans, cards, ▲/▼ on all gains and losses, Practice mode badge) — the learner supplied a detailed design brief after trying the playful version; `prd.md > Look and Feel` and `spec.md > Look and Feel` updated.
- Restart the dev server after editing `tailwind.config.js` — the running Vite server didn't pick up config changes, so new color/font classes failed in the browser even though `npm run build` passed. CSS is now verified through the dev server.
- Switched to a light, mint-green brokerage style with a dark hero card and floating Buy/Sell pill, dropping dark mode — the learner shared a reference app screenshot ("minimalistic but aesthetic"); Look and Feel updated in PRD and spec.
- Added slice 4, Learning extras ("What happened?" breakdown, badges, allocation donut), and renumbered the tutorial to 5 — the learner chose to add the three features suggested by their design brief; accent changed from mint green to mint blue.
