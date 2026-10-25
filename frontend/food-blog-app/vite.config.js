import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const backendProxy = {
  '/api': {
    target: 'http://localhost:5000',
    changeOrigin: true,
  },
  '/images': {
    target: 'http://localhost:5000',
    changeOrigin: true,
  },
}

export default defineConfig({
  plugins: [react()],
  server: { proxy: backendProxy },
  preview: { proxy: backendProxy },
})
