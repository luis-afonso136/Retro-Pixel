/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        base: '#000000',
        accent: '#FFD700',
        surface: '#0A0A0A',
        line: '#1A1A1A',
        textSoft: '#B6B6B6',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        arcade: ['"Press Start 2P"', 'monospace'],
      },
      boxShadow: {
        card: '0 6px 24px rgba(0, 0, 0, 0.45)',
        glow: '0 0 0 1px rgba(255, 215, 0, 0.3), 0 0 22px rgba(255, 215, 0, 0.2)',
        pixel: '0 0 0 1px #FFD700, 2px 2px 0 rgba(255, 215, 0, 0.6)',
      },
      keyframes: {
        retroPulse: {
          '0%, 100%': { opacity: '0.92' },
          '50%': { opacity: '1' },
        },
        coinFlicker: {
          '0%, 100%': { color: '#FFD700', textShadow: '0 0 0 transparent' },
          '20%': { color: '#fff4b0', textShadow: '0 0 12px rgba(255, 215, 0, 0.85)' },
          '40%': { color: '#FFD700', textShadow: '0 0 0 transparent' },
          '60%': { color: '#fff4b0', textShadow: '0 0 10px rgba(255, 215, 0, 0.75)' },
          '80%': { color: '#FFD700', textShadow: '0 0 0 transparent' },
        },
      },
      animation: {
        'pulse-retro': 'retroPulse 1.6s ease-in-out infinite',
        'coin-flicker': 'coinFlicker 380ms linear 1',
      },
    },
  },
  plugins: [],
}

