import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  build: {
    target: 'es2019',  // ← ADD THIS — makes ?. and ?? compatible with older Chromium
  },

  optimizeDeps: {
    include: ['globe.gl', 'three-globe', 'frame-ticker', 'three'],
  },

  server: {
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
})