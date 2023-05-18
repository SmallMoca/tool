import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import svgr from 'vite-plugin-svgr';
import path from 'path';
import myVirtualPlugin from './plugins/my-virtual-plugin';
const myVitePlugin = require('./plugins/my-vite-plugin.js');
import autoprefixer from 'autoprefixer';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  root: path.resolve(__dirname, './'),
  plugins: [react(), svgr(), myVitePlugin(), myVirtualPlugin()],
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },

  css: {
    modules: {
      generateScopedName: '[local]__[hash:base64:5]',
      localsConvention: 'camelCaseOnly',
    },
    postcss: {
      plugins: [
        autoprefixer({
          overrideBrowserslist: [
            'last 2 versions',
            '> 1%',
            'iOS 7',
            'last 3 iOS versions',
          ],
        }),
      ],
    },
  },

  optimizeDeps: {
    entries: [path.resolve(__dirname, 'src/app.tsx')],
    // exclude: ['lodash-es'],
  },
  server: {
    host: true,
    port: 1111,
    strictPort: true,
    /** 启用 HMR */
    hmr: true,
  },
});
