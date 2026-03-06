/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        war: {
          black: '#0a0a0f',
          dark: '#111118',
          panel: '#16161f',
          border: '#1e1e2e',
          red: '#e63946',
          orange: '#f4a261',
          amber: '#e9c46a',
          green: '#2a9d8f',
          blue: '#457b9d',
          text: '#cdd6f4',
          muted: '#6c7086',
        },
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'monospace'],
        display: ['"Bebas Neue"', 'sans-serif'],
        body: ['"IBM Plex Sans"', 'sans-serif'],
      },
      backgroundImage: {
        'grid-pattern': 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
      },
      backgroundSize: {
        'grid': '40px 40px',
      },
    },
  },
  plugins: [],
};
