import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // BASE_PATH is set by the GitHub Pages workflow (e.g. "/Speaking-Engagements-Portfolio/").
  // Locally, and on a custom domain, it defaults to "/".
  base: process.env.BASE_PATH || '/',
})
