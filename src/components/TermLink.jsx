// Tappable term: accent color + dotted underline (spec.md > Look and Feel).
export default function TermLink({ id, children, onOpen }) {
  return (
    <button
      onClick={() => onOpen(id)}
      className="text-accent underline decoration-dotted decoration-accent/60 underline-offset-4 hover:decoration-solid"
    >
      {children}
    </button>
  )
}
