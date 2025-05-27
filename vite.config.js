import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  base: '/src/',
  root: resolve(__dirname, 'src'),
  server: {
    port: 5173,
    strictPort: true,
    headers: {
      "Content-Security-Policy": [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline'",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data:"
      ].join('; ')
    },
    proxy: {
      '/test': {
        target: 'http://localhost:5173',
        rewrite: path => path.replace(/^\/test/, '/src/test.html')
      }
    },
    open: '/src/index.html' // Default page to open
  },
  publicDir: 'public',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
        test: resolve(__dirname, 'src/test.html')
      }
    },
    outDir: '../dist',
    emptyOutDir: true
  }
})
