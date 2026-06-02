import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],

  // change this to '/portfolio/' if serving from a subdirectory/drop the domain
  base: '/',

  build: {
    // delete this line for a smaller deploy artifact.
    sourcemap: false,

    // keep vendor separate from app code so returning visitors only re-download changed chunks.
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          motion: ['framer-motion'],
          i18n:   ['i18next', 'react-i18next'],
        },
      },
    },
  },
})
