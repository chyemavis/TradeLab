// Explainable term: teal dotted underline + info mark (spec.md > Look and Feel).
export default function TermLink({ id, children, onOpen }) {
  return (
    <button onClick={() => onOpen(id)} className="term" aria-label={`What is ${children}?`}>
      {children}
      <span aria-hidden="true" className="text-xs no-underline opacity-70">ⓘ</span>
    </button>
  )
}
