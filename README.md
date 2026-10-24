# Practice Portfolio

A practice trading app with pretend money for investing beginners. Buy and sell stocks, tap confusing terms (market cap, P/E ratio, volatility, dividend, unrealized gain/loss) to see a plain-English explanation with a short animation, and play two games about risk and diversification.

Built as a proof of concept for Devpost's *Build With AI: Basics* hackathon. Designed for phones.

> **Not real money or real market data.** Prices are simulated from rounded sample figures, and the game scenarios are stylized. Nothing here is investment advice.

## Run it

Requires [Node.js](https://nodejs.org) 18 or newer. No API keys or accounts needed.

```bash
npm install
npm run dev
```

Open http://localhost:5173. Use a narrow window or your browser's phone/device mode for the intended layout.

**On a phone (same Wi-Fi):** run `npx vite --host`, then open `http://<your-computer's-IP>:5173` on the phone.

To start over (cash back to $10,000 and the intro shown again), use **Reset demo** at the bottom of the Learn tab.

## What's inside

| Tab | What it does |
|---|---|
| Home | Portfolio value, top up, holdings, allocation donut |
| Explore | 8 sample stocks with simulated live prices |
| Games | *The 15-Year Race* (risk vs. reward) and *Don't Drop the Coins* (diversification), played in landscape |
| Learn | All five explained terms, badges, and reset |

Your practice portfolio is saved in the browser (`localStorage`), so it stays after a reload.

## Tech

React 18, Vite 5, Tailwind CSS 3, and Framer Motion. There is no backend. Charts and animations are hand-drawn SVG.

- `src/state/portfolio.js`: trading rules, badges, and trade explanations
- `src/games/sim.js`: game rules
- `src/index.css`: color tokens for the whole app

`devpost/` contains the planning documents (scope, PRD, spec, build checklist) and `devpost/app-map.html`, a guide to the code.
