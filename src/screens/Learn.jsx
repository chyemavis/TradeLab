import { TERMS } from '../data/terms.js'
import { BADGES } from '../state/portfolio.js'
import { usePortfolio } from '../state/PortfolioContext.jsx'

// Learn tab: every explained term in one place, plus badges and reset.
export default function Learn({ onTerm, onReset }) {
  const { learnedTerms, earned } = usePortfolio()
  const ids = Object.keys(TERMS)

  return (
    <div className="pb-28 px-4">
      <header className="pt-6">
        <h1 className="text-2xl font-bold">Learn</h1>
        <p className="text-muted text-sm mt-1">The words you'll see on stock pages, explained with a short animation.</p>
      </header>

      <section className="mt-5">
        <div className="flex items-baseline justify-between">
          <h2 className="text-lg font-semibold">Terms</h2>
          <span className="text-muted text-sm num">{learnedTerms.length} of {ids.length} opened</span>
        </div>
        <ul className="card mt-3 px-4">
          {ids.map((id) => {
            const seen = learnedTerms.includes(id)
            return (
              <li key={id} className="border-b border-line last:border-0">
                <button onClick={() => onTerm(id)} className="w-full flex items-center gap-3 py-3.5 text-left">
                  <span className={`w-7 h-7 rounded-full grid place-items-center text-sm shrink-0 ${seen ? 'bg-accent text-white' : 'bg-accent/10 text-accent'}`}>
                    {seen ? '✓' : 'ⓘ'}
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block font-semibold">{TERMS[id].title}</span>
                    <span className="block text-muted text-sm truncate">{TERMS[id].explanation}</span>
                  </span>
                  <span className="text-muted" aria-hidden="true">›</span>
                </button>
              </li>
            )
          })}
        </ul>
      </section>

      <section className="mt-7">
        <div className="flex items-baseline justify-between">
          <h2 className="text-lg font-semibold">Badges</h2>
          <span className="text-muted text-sm num">{earned.length} of {BADGES.length}</span>
        </div>
        <ul className="grid grid-cols-2 gap-3 mt-3">
          {BADGES.map((b) => {
            const got = earned.includes(b.id)
            return (
              <li key={b.id} className={`card p-3 flex items-center gap-3 ${got ? '' : 'opacity-60'}`}>
                <span className={`w-9 h-9 rounded-full grid place-items-center shrink-0 ${got ? 'bg-accent/15' : 'bg-line grayscale'}`}>{b.icon}</span>
                <div className="min-w-0">
                  <p className="font-semibold text-sm">{b.title}</p>
                  <p className="text-muted text-xs">{got ? 'Earned' : b.hint}</p>
                </div>
              </li>
            )
          })}
        </ul>
      </section>

      <button
        onClick={() => window.confirm('Start over with $10,000 and see the intro again? This clears your practice portfolio.') && onReset()}
        className="text-muted text-xs underline underline-offset-2 mt-8 hover:text-ink"
      >
        Reset demo
      </button>
    </div>
  )
}
