const webpack = require('webpack');
const path = require('path');

const compiler = webpack({
  entry: path.resolve(__dirname, '../src/code-spliting/index.js'),
  mode: 'none',
  output: {
    clean: true,
    iife: false,
    pathinfo: 'verbose',
    path: path.resolve(__dirname, '../dist/split'),
    hashFunction: 'xxhash64',
    filename: 'main.[id].[contenthash].js',
    chunkFilename: '[name].[id].chunk.[contenthash].js',
  },
});
compiler.run((err) => {
  if (err) {
    console.log(errr);
  }
});
