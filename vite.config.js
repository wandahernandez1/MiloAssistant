// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // Reemplaza 3000 si tu NestJS está en otro puerto
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, ''), // No necesario si las rutas coinciden
      },
    },
  },
});