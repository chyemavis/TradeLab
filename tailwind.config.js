/** Colors and type from spec.md > Look and Feel */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        night: '#1B1640',
        surface: '#262055',
        line: '#352D6E',
        chalk: '#F3EFFF',
        lilac: '#A39DC9',
        gain: '#63E6BE',
        loss: '#FF7E8F',
        coin: '#FFC84A',
      },
      fontFamily: {
        sans: ['Figtree', 'system-ui', 'sans-serif'],
        display: ['"Bricolage Grotesque"', 'Figtree', 'sans-serif'],
      },
    },
  },
}
