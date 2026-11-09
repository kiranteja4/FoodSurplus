/** Organic Sustainability palette and small set of interface tokens. */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#f1f7f3',
          100: '#dcebe1',
          500: '#2f7a4f',
          600: '#25633f',
          700: '#1d4f33',
          800: '#163d27',
          900: '#0f2b1b',
          950: '#0a2114',
        },
        sage: {
          50: '#f5f7f1',
          100: '#e9efe2',
          200: '#d8e3cf',
          300: '#c3d2b8',
          400: '#a5bc98',
          500: '#829f79',
          600: '#63846a',
          700: '#4e6c55',
          800: '#3a5541',
          900: '#2b4033',
        },
        earth: {
          100: '#f5e8dc',
          500: '#a5663e',
          600: '#8e5433',
          700: '#754329',
          800: '#603820',
        },
        harvest: {
          100: '#f7eed9',
          700: '#79501d',
          900: '#533711',
        },
        paper: '#faf8f3',
        ink: '#1f2622',
        'ink-muted': '#58635c',
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 8px 24px rgb(24 50 33 / 5%)',
        'card-hover': '0 16px 34px rgb(24 50 33 / 9%)',
      },
    },
  },
  plugins: [],
};
