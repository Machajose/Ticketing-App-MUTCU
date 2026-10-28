/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: { ink: '#11100f', panel: '#191817', line: '#302e2b', ember: '#ff5a1f', gold: '#f6b944', cream: '#f7f2e9' },
      fontFamily: { sans: ['Inter', 'ui-sans-serif', 'system-ui'], display: ['Manrope', 'Inter', 'ui-sans-serif'] },
      boxShadow: { glow: '0 0 45px rgba(255, 90, 31, .13)' },
    },
  },
  plugins: [],
};
