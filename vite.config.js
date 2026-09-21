import { defineConfig } from 'vite'

export default defineConfig({
  root: './src',
  envDir: '../',
  server: {
    open: '/index.html'
  }
})
