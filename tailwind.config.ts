import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        mine: {
          950: '#0e1116',
          900: '#151a21',
          800: '#1d2430',
          700: '#2a3443'
        },
        hazard: {
          green: '#22c55e',
          yellow: '#eab308',
          red: '#ef4444'
        }
      }
    }
  },
  plugins: []
};

export default config;
