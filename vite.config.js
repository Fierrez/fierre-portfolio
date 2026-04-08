import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  
  plugins: [
    react(),
    // tailwindcss()
  ],
  // Use the repo base path when building for production so assets load correctly on GitHub Pages.
  base: process.env.NODE_ENV === 'production' ? '/fierre-portfolio/' : '/',
})
