/** Brand palette: forest green + emerald on warm off-white. */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        forest: { 50: '#f1f7f3', 100: '#dcebe1', 500: '#2f7a4f', 600: '#25633f', 700: '#1d4f33', 800: '#163d27', 900: '#0f2b1b' },
        emerald: { 400: '#34d399', 500: '#10b981', 600: '#059669' },
        paper: '#faf8f3',
        ink: '#1f2622',
      },
      fontFamily: { display: ['Fraunces', 'Georgia', 'serif'], sans: ['Inter', 'system-ui', 'sans-serif'] },
    },
  },
  plugins: [],
};
