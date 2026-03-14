/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      colors: {
        cream:  '#faf7f2',
        blush:  '#f5e6e0',
        rose:   '#e8c5bc',
        dusty:  '#c9968a',
        mauve:  '#9d6e65',
        wine:   '#6b3d38',
        ink:    '#2c1a17',
        fog:    '#f0ebe4',
        gold:   '#c8a97e',
        'gold-light': '#eddcc4',
      },
      animation: {
        'fade-up': 'fadeUp 0.7s ease forwards',
        'fade-in': 'fadeIn 0.6s ease forwards',
        'ticker':  'ticker 30s linear infinite',
        'float':   'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
      },
      keyframes: {
        fadeUp:     { from: { opacity: 0, transform: 'translateY(24px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        fadeIn:     { from: { opacity: 0 }, to: { opacity: 1 } },
        ticker:     { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
        float:      { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-12px)' } },
        shimmer:    { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        pulseSoft:  { '0%,100%': { opacity: 0.4 }, '50%': { opacity: 0.8 } },
      },
      backgroundImage: {
        'hero-gradient': 'radial-gradient(ellipse 80% 60% at 50% 20%, rgba(232,197,188,0.45) 0%, transparent 65%), radial-gradient(ellipse 50% 70% at 15% 80%, rgba(200,169,126,0.2) 0%, transparent 60%), linear-gradient(180deg, #faf7f2 0%, #f8f2ec 60%, #f2e9e0 100%)',
      },
      boxShadow: {
        'luxury': '0 20px 60px rgba(107,61,56,0.12)',
        'luxury-lg': '0 40px 80px rgba(44,26,23,0.2)',
        'card': '0 4px 24px rgba(107,61,56,0.06)',
      },
    },
  },
  plugins: [],
}
