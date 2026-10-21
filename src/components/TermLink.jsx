// Tappable learning term: a coin-yellow sticker chip (spec.md > Look and Feel).
export default function TermLink({ id, children, onOpen }) {
  return (
    <button onClick={() => onOpen(id)} className="term-chip" aria-label={`Explain ${children}`}>
      {children}
    </button>
  )
}
