import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  envDir: '../',
  server: {
    port: 5000
  },
  build: {
    outDir: '../backend/src/main/resources/static/vue',
    emptyOutDir: true
  }
})
