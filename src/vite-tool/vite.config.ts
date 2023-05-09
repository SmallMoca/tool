import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import svgr from 'vite-plugin-svgr';
import path from 'path';

import autoprefixer from 'autoprefixer';
console.log(process.env);

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  root: path.resolve(__dirname, './'),
  plugins: [react(), svgr()],
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
  server: {
    host: true,
    port: 1111,
    strictPort: true,
    /** 启用 HMR */
    hmr: true,
  },
});
