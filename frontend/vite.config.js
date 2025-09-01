import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    // The proxy configuration must be inside the 'server' object
    proxy: {
      '/users': 'https://agent-kauc.onrender.com',
      '/projects': 'https://agent-kauc.onrender.com',
      '/socket.io': 'https://agent-kauc.onrender.com',
    },
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
  },
})