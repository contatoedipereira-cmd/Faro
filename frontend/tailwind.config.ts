import type { Config } from 'tailwindcss';

// Tokens da marca FARO — preto premium + dourado como único acento.
// Ver seção 1 do documento de arquitetura para o racional da identidade.
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#050505',
        surface: {
          1: '#121212',
          2: '#1b1b1b',
        },
        border: {
          DEFAULT: '#2a2a2a',
          strong: '#3a3a3a',
        },
        gold: {
          DEFAULT: '#ed9e19',
          muted: '#3a2c0f',
          soft: '#f4b64a',
        },
        text: {
          primary: '#f5f5f0',
          secondary: '#9c9992',
          muted: '#6b6862',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
      },
      borderRadius: {
        card: '14px',
      },
    },
  },
  plugins: [],
};

export default config;
