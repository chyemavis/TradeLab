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
Added at final review, designed by the learner. Both use separate game money ($10,000) and never touch the practice portfolio.
- **Risk vs. reward:** a slider sets the % in stocks (the rest is safe savings at +3% a year). Ten random years of boom (stocks +25%), flat (+2%), or crash (−30%) are applied equally to your mix, a 90% stocks mix, and a 40% stocks mix.
  - [ ] All three paths show on one chart with year labels and end values; "New years" draws new random years.
- **Diversification challenge:** split $10,000 across Tech, Energy, Health, and Consumer in $1,000 steps. A crash hits one random sector (−50%) and the others gain +6%.
  - [ ] It shows your result vs. all-in on the crashed sector vs. an even split, plus a one-line takeaway; "Play again" resets it.
  - [ ] You can't start until all $10,000 is placed.

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
