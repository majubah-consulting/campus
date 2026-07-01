import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/campus/',
  plugins: [react()],
  build: {
    rollupOptions: { input: 'index.source.html' },
  },
  server: { host: '127.0.0.1', port: 4173 },
})
