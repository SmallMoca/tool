import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import svgr from 'vite-plugin-svgr';
import path from 'path';
import myVirtualPlugin from './plugins/my-virtual-plugin';

const myVitePlugin = require('./plugins/my-vite-plugin.js');
import autoprefixer from 'autoprefixer';
import Inspect from 'vite-plugin-inspect';
import pugPlugin from './plugin/pug';
import myVirtualHtml from './plugin/my-virtual';
import ViteTemplatePlugin from './vite-template-plugin/index';

const myCustomPlugin = require('./plugins/my-custom-plugin');
// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  root: path.resolve(__dirname, './'),
  plugins: [
    react(),
    svgr(),
    // pugPlugin({ template: './index.pug', entry: './src/index.tsx' }),
    myVitePlugin({
      entry: './src/index.tsx',
    }),
    myVirtualPlugin(),
    // myVirtualHtml({ template: './index.pug', entry: './src/index.tsx' }),
    Inspect(),
    ViteTemplatePlugin([
      { template: './index.pug', entry: './src/index.tsx' },
      {
        template: './tpl/test/index.html',
      },
      {
        template: './index-tpl.html',
      },
    ]),
  ],
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
    // entries: [path.resolve(__dirname, 'src/app.tsx')],
    // exclude: ['lodash-es'],
  },
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'entry-[name].js',
      },
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
