const path = require('path');
const resolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const terserPlugin = require('rollup-plugin-terser');

/**
 * @type {import('rollup').RollupOptions}
 */
const buildConfig = {
  input: [path.resolve(__dirname, 'src/index.js')],
  output: [
    {
      dir: path.resolve(__dirname, 'dist/es'),
      format: 'esm',
      plugins: [terserPlugin.terser()],
    },
    {
      dir: path.resolve(__dirname, 'dist/cjs'),
      format: 'cjs',
    },
  ],
  plugins: [resolve(), commonjs()],
};

module.exports = buildConfig;

// rollup 的一些特点
// 天然自带 tree shaking 功能
