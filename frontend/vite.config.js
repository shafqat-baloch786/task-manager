import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    // This prevents Vite from getting confused by quick file changes
    watch: {
      usePolling: true,
    },
    // This ensures HMR stays connected
    hmr: {
      overlay: false, 
    }
  }
})