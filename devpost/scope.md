---
doc: scope
status: approved
---

# Practice Portfolio (working title)

A practice trading app with fake money that shows beginners what investing terms mean, visually and in plain English.

## The Unique Kernel
Investing terms and charts are explained through a mix of text and visual aids, not just text definitions. You tap a confusing term and see what it means, while you're trading.

## Who It's For
A complete investing beginner, like the learner, who wants to start investing but doesn't know "where to even start. What is good or bad? where to find these info from?" Today they would read about investing before putting in real money, without a safe place to try it.

## The Core Loop
Open the app, browse stocks, and buy or sell with fake money. Whenever a term or number is unclear, tap it to get a plain-English explanation with a visual aid. Then check the portfolio to see how the picks are doing.

## Inspiration & Identity
It should look and feel like a real trading app, not a toy. There is no specific reference app yet.

## Why This Matters to the Learner
They want to start investing but have almost no knowledge yet, and want to "learn more about it through our implementation." It's also practice for their goal of getting better design output from AI-built apps, since the visual explanations depend on good design.

## What "Working" Looks Like
In the demo, someone goes through a short intro tutorial, buys and sells a stock with fake money, and sees the result in a portfolio view. They tap a confusing term and get an explanation with a visual aid. The "oh, that's cool" moment is that visual explanation. The demo shows how to use the app and what makes it different from other paper-trading apps.

## The POC Boundary
- Short intro tutorial
- Buy and sell with a fake cash balance
- Portfolio view
- Tap-to-explain for a small set of terms (text plus visual aid)

## Later
- More creative or interactive ways of showing what terms mean, beyond text plus a visual aid
- Explanations for more terms

## Explicitly Cut
- **Real money and brokerage connections:** this is a practice tool, and handling real money adds risk and complexity that don't help prove the idea.
- **User accounts and login:** they aren't needed to show the core loop in a 1-minute demo.

## Open for Later Phases
- Whether stock prices are real (from an API) or simulated. To be decided in PRD or spec.
- Which terms get explanations in the proof of concept.
