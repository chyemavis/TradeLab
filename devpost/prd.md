---
doc: prd
status: approved
---

# Practice Portfolio — Product Requirements

A practice trading app with fake money for complete investing beginners. It looks like a real trading app, and its confusing terms are explained with plain English and a mini animation.
Source: `scope.md > The Unique Kernel`, `scope.md > Who It's For`.

## The Core Journey
1. **First open:** the user sees a short intro to the app, then gets the option to take a guided buy-and-sell tutorial or skip it.
2. **Guided tutorial (optional):** walks them through buying and then selling a stock in the real interface.
3. **Home:** they see their fake cash balance and how their current stocks are doing.
4. **Browse:** they open a stock's detail screen, which shows its price, a chart, and key terms.
5. **Learn:** they tap a term (for example, P/E ratio) and get a plain-English explanation with a mini animation.
6. **Trade:** they buy or sell shares with fake money. Invalid trades are blocked with an error message.
7. **Return:** back on home, their balance and holdings reflect the trade. Prices keep moving, so gains and losses change over time.
8. **Come back later:** their cash and stocks are still there.

Success means the user has made a trade, watched it gain or lose value, and understood at least one term they didn't know before.
Source: `scope.md > The Core Loop`, `scope.md > What "Working" Looks Like`.

## Screens and Layout
- **Bottom tabs** (added at final review so it isn't all on one screen): **Home** (portfolio card with a Top up button inside it, holdings, allocation), **Explore** (stock list), **Learn** (all five terms with opened ✓, badges, reset demo), **Games** (two learning games). Tabs hide on a stock's page, where the Buy/Sell pill sits.
- **Intro:** a short welcome to the app, ending with a choice: "Take the guided tutorial" or "Skip."
- **Home:** the cash balance at the top, then the user's holdings and how they're doing, plus a way to browse stocks and to top up fake money.
- **Stock detail:** price, a chart, key terms (tappable), and Buy / Sell buttons.
- **Term explanation:** an overlay or sheet with a plain-English explanation and a mini animation. Closing it returns to the stock.
- **Trade:** choose the number of shares, see the total cost, and confirm.

## Look and Feel
- Minimalistic but aesthetic, like the learner's reference brokerage app: white, mint-green accent, and a dark portfolio hero card.
- Green gains and red losses, always with ▲/▼ and +/−.
- A "Practice" pill so the money is clearly pretend.
- The term animations are the design highlight.

## Features and Behavior

### Intro and Guided Tutorial
- [ ] On first open, a short intro to the app appears.
- [ ] The intro ends with the option to start the guided tutorial or skip it.
- [ ] The tutorial walks through one buy and one sell on the real screens.
- [ ] After the intro or tutorial is finished or skipped, it doesn't appear again on later opens.

### Home and Portfolio
- [ ] The fake cash balance is shown prominently.
- [ ] Each holding shows the stock, the shares owned, the current value, and the gain/loss (amount and %).
- [ ] Values update as prices move.

### Stock Detail and Prices
- [ ] Each stock shows its current price and a price chart.
- [ ] Prices move over time in a realistic way.

### Term Explanations (the kernel)
Source: `scope.md > The Unique Kernel`.
- [ ] Five terms are tappable wherever they appear: **market cap, P/E ratio, volatility, dividend, unrealized gain/loss**.
- [ ] Tapping one shows a short plain-English explanation plus a mini animation that illustrates the idea.
- [ ] Each term has its own animation, not one generic animation for all five.

### Buying and Selling
- [ ] The user can buy shares if they have enough cash. Cash decreases and the holding appears or grows.
- [ ] The user can sell shares they own. Cash increases and the holding shrinks or disappears.
- [ ] Buying more than their cash covers is blocked with an error message.
- [ ] Selling more shares than they own is blocked with an error message.

### Top Up Fake Money
- [ ] The user can add fake cash to their balance.

### Learning Extras
Added during the build at the learner's request.
- [ ] After a buy or sell, a "What happened?" breakdown shows what you paid or got, the cash left, and either what a 5% move would mean (buy) or the gain/loss you just locked in (sell).
- [ ] Badges: **First trade** (first buy), **First sale** (first sell), **Diversified** (own 3 different stocks at once), and **Word nerd** (opened all 5 terms). Earning one shows a short, calm notice, and Home shows earned and locked badges.
- [ ] Once you own stocks, Home shows an allocation donut: how your total value splits across cash and each stock, with a legend.

### Games
Designed by the learner at final review (trimmed version agreed: no Level 2 and no "hot tip" wildcard). Both use separate game money and never touch the practice portfolio. Each takes about 4–5 minutes, and both have an **Auto-play** option for quick demos.
- **The 15-Year Race (risk vs. reward):** a cautious/balanced/bold shortcut sets the starting stock mix; the goal is "Beat 🐢 and 🐆, or reach $20,000." Each year has a news hint, a decision on a gentle 8-second timer (hold, nudge the mix ±10%, or add $1,000; time-out = hold), then a market reveal and a one-line debrief. Rivals: 🐆 90% stocks, 🐢 40% stocks.
  - [ ] Year sequences are stylized from real patterns (labeled), and each one includes at least one crash and one boom.
  - [ ] Life event in year 5: a $2,000 car repair, paid by selling stocks, using savings, or skipping contributions for 2 years.
  - [ ] Panic moment in year 9 after a −25% drop: sell everything, hold, or buy more. Year 10 rebounds.
  - [ ] End: stars for goal reached, beating 🐆 on risk-adjusted return, and never panic-selling; a podium; an "if you'd never touched it" comparison line; and one badge (Steady Hands / Panic Seller / Bold Buyer).
- **Don't Drop the Coins (diversification):** 6 rounds. Each round gives a clue, then you place 10 coins (each coin = 10% of your current money), then the market runs and you see the result and lesson. Money carries forward between rounds.
  - [ ] A risk meter shows how concentrated you are, with a soft warning at 7+ coins in one basket.
  - [ ] Progression: rounds 1–2 hit one sector; rounds 3–4 bring a boom plus a fall, or two hits; round 5 is a market-wide crash where a surprise Bonds basket appears; round 6 combines effects.
  - [ ] End: ⭐ survived, ⭐⭐ ended with growth, ⭐⭐⭐ growth and at least 3 coins in Bonds during the crash; the total counts up; and a comparison with keeping everything in one basket.

## States and Boundaries
- **First use:** the intro appears, the starting cash balance is shown, and there are no holdings yet.
- **Empty portfolio:** the home screen says there are no stocks yet and points to browsing.
- **Invalid trade:** an error message appears and nothing changes.
- **Persistence:** cash, holdings, and whether the intro has been seen are kept between sessions.

## Product Decisions
- Intro first, tutorial optional, so people who want to explore aren't forced through it.
- Minimal and dark, like a real trading app, for realism.
- Explain terms that are "important but not easy to understand just from their spelling," using text plus a mini animation.
- The five terms: market cap, P/E ratio, volatility, dividend, unrealized gain/loss.
- Invalid trades aren't allowed; an error message shows instead.
- Portfolio persists and prices move, for realism.
- Fake money can be topped up.
- **Assumption:** a starting balance of $10,000 in fake cash.

## What We're Building
Intro with an optional tutorial, home and portfolio, stock detail with moving prices, five animated term explanations, buy and sell with validation, top-up, and persistence.

## Deferred From the POC
- Explanations for more terms, because five is enough to prove the kernel.
- More creative or interactive explanation formats beyond text plus animation.

## Non-Goals
- Real money or brokerage connections, since it's a practice tool.
- Accounts and login, since one user on one device is enough for the demo.
- Investment advice or recommendations, since it teaches terms rather than telling users what to buy.

## Open Questions
- **Real versus simulated prices:** "move like real ones do" could mean live market data or a realistic simulation. Decide in `4-spec`; either meets the PRD.
- **Which stocks are available:** a small fixed list is likely enough. Decide in `4-spec`.
