import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  optimizeDeps: {
    // Force Vite to pre-bundle these CJS/broken-ESM packages so the
    // "does not provide an export named 'default'" error disappears
    include: [
      'globe.gl',
      'three-globe',
      'frame-ticker',
      'three',
    ],
  },

  server: {
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
})