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
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (id.includes('react-dom') || id.includes('react/')) return 'vendor'
          if (id.includes('framer-motion')) return 'motion'
          if (id.includes('i18next')) return 'i18n'
        },
      },
    },
  },
})
