import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Des chemins relatifs permettent au même build de fonctionner à la racine
  // de Cloudflare Pages et dans le sous-dossier /campus/ de GitHub Pages.
  base: './',
  plugins: [react()],
  build: {
    rollupOptions: { input: 'index.source.html' },
  },
  server: { host: '127.0.0.1', port: 4173 },
})
