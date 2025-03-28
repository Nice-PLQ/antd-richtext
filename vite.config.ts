import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import commonjs from 'vite-plugin-commonjs';
import pkg from './package.json';

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        math: 'always',
        javascriptEnabled: true,
      },
      scss: {
        api: 'modern-compiler',
      },
    },
  },
  define: {
    PKG_VERSION: JSON.stringify(pkg.version),
  },
  plugins: [
    react(),
    commonjs(),
    svgr({
      svgrOptions: {
        exportType: 'named',
        namedExport: 'ReactComponent',
        memo: true,
        plugins: ['@svgr/plugin-svgo', '@svgr/plugin-jsx'],
      },
      include: /\.svg$/,
    }),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './test-setup.ts',
    // @ts-ignore
    coverage: {
      include: ['src/**/*'],
      exclude: ['src/i18n/*', 'src/__test__'],
    },
  },
});
