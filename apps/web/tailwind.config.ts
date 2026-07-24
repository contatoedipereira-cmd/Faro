import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        faro: {
          black: '#000000',
          gold: '#ed9e19',
          surface: '#121212',
          surface2: '#1a1a1a',
          border: '#2a2a2a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
