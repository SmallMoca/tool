import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

console.log(path.resolve(__dirname, './'));

// https://vitejs.dev/config/
export default defineConfig({
  root: path.resolve(__dirname, './'),
  plugins: [react()],
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  server: {
    host: true,
    port: 8111,
    strictPort: true,
    /** 启用 HMR */
    hmr: false,
  },
});
