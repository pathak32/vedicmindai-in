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
        manualChunks: {
          // Core React runtime — cached aggressively, changes rarely
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          // Animation library — large, shared, rarely changes
          'vendor-framer': ['framer-motion'],
          // Supabase client — large, shared, rarely changes
          'vendor-supabase': ['@supabase/supabase-js'],
          // Landing page data (FAQ, comparison data, etc.) — separate from app logic
          'landing-data': [
            './src/data/faqData.js',
          ],
        },
      },
    },
  },
})

