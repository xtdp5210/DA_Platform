import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => ({
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],

  build: {
    // No source maps in production — hides original source files from browser devtools
    sourcemap: false,

    // Minify & mangle all identifiers so code is unreadable
    minify: 'terser',
    terserOptions: {
      compress: {
        // Remove all console.* calls so internals aren't logged
        drop_console: true,
        drop_debugger: true,
      },
      mangle: {
        // Mangle top-level names for maximum obfuscation
        toplevel: true,
      },
      format: {
        // Strip all comments from output
        comments: false,
      },
    },

    rollupOptions: {
      output: {
        // Hash-based chunk names — no readable module paths in network tab
        chunkFileNames: 'assets/[hash].js',
        entryFileNames: 'assets/[hash].js',
        assetFileNames: 'assets/[hash].[ext]',
      },
    },
  },
}))
