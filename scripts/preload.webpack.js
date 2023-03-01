const webpack = require('webpack');
const path = require('path');

const compiler = webpack({
  entry: path.resolve(__dirname, '../src/magic-comment/index.js'),
  mode: 'none',
  output: {
    clean: true,
    iife: false,
    pathinfo: 'verbose',
    path: path.resolve(__dirname, '../dist/preload'),
    hashFunction: 'xxhash64',
    filename: 'main.[id].[contenthash].js',
    chunkFilename: '[name].[id].chunk.[contenthash].js',
    // chunkFormat: 'module',
    // chunkLoading: 'import',
  },
});
compiler.run((err) => {
  if (err) {
    console.log(errr);
  }
});
