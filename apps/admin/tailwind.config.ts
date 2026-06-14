import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        blue: { dark: '#0A4DB8', mid: '#1A7FE8', accent: '#3BBFFF', bg: '#EBF4FF' },
        neutralbg: '#F5F7FA',
        text: { dark: '#0D1B3E', mid: '#334E7B' },
      },
    },
  },
  plugins: [],
};

export default config;
