/** Colors and type from spec.md > Look and Feel; values live as CSS variables in index.css (dark + light). */
const v = (name) => `rgb(var(--${name}) / <alpha-value>)`

export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: v('bg'),
        surface: v('surface'),
        line: v('line'),
        ink: v('ink'),
        muted: v('muted'),
        accent: v('accent'),
        gain: v('gain'),
        loss: v('loss'),
        practice: v('practice'),
        hero: v('hero'),
      },
      fontFamily: { sans: ['"DM Sans"', 'system-ui', 'sans-serif'] },
    },
  },
}
