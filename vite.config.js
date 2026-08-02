import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Only split out React itself -- it's the one library that
          // truly never changes and benefits most from long-term caching.
          // Everything else (Supabase, Framer) stays in the main bundle
          // because splitting them adds extra round trips on mobile that
          // cost more than the bytes saved.
          if (id.includes('node_modules/react/') ||
              id.includes('node_modules/react-dom/') ||
              id.includes('node_modules/react-router-dom/') ||
              id.includes('node_modules/scheduler/')) {
            return 'vendor-react';
          }
        },
      },
    },
  },
})


