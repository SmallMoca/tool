import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

import autoprefixer from 'autoprefixer';
// https://vitejs.dev/config/
export default defineConfig({
  root: path.resolve(__dirname, './'),
  plugins: [react()],
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  css: {
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
