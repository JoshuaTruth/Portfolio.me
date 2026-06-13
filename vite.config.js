import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        'graphic-design': resolve(__dirname, 'graphic-design.html'),
      },
    },
  },
})
