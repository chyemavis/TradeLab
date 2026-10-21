/** Colors and type from spec.md > Look and Feel */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0B0E11',
        surface: '#151A21',
        line: '#232A33',
        text: '#E8ECF1',
        muted: '#8A94A3',
        gain: '#22C55E',
        loss: '#EF4444',
        accent: '#7C9CFF',
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
    },
  },
}
