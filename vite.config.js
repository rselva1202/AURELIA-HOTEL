import { defineConfig } from 'vite';

export default defineConfig({
  base: '/AURELIA-HOTEL/',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    chunkSizeWarningLimit: 1200,
  },
});
