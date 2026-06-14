import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        blue: {
          dark: '#0A4DB8',
          mid: '#1A7FE8',
          accent: '#3BBFFF',
          bg: '#EBF4FF',
        },
        neutralbg: '#F5F7FA',
        text: {
          dark: '#0D1B3E',
          mid: '#334E7B',
        },
        telegram: '#229ED9',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-plex-mono)', 'ui-monospace', 'monospace'],
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scroll: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        pulseRing: {
          '0%': { boxShadow: '0 0 0 0 rgba(34,158,217,0.6)' },
          '70%': { boxShadow: '0 0 0 16px rgba(34,158,217,0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(34,158,217,0)' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.5s ease forwards',
        scroll: 'scroll 30s linear infinite',
        'pulse-ring': 'pulseRing 8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
