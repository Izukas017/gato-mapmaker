import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? '/gato-mapmaker/' : '/',
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: false,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
          if (id.includes('/engine/objects/') || id.includes('\\engine\\objects\\')) {
            return 'prop-painters';
          }
          if (id.includes('/engine/animals') || id.includes('\\engine\\animals')) {
            return 'animals-data';
          }
          if (id.includes('/engine/surfaces') || id.includes('\\engine\\surfaces')) {
            return 'surfaces-data';
          }
        },
      },
    },
  },
});
