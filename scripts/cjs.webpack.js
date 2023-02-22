const webpack = require('webpack');
const path = require('path');
const compiler = webpack({
  entry: {
    cjs: path.resolve(__dirname, '../src/cjs/index.js'),
    esm: path.resolve(__dirname, '../src/esm/index.js'),
  },
  mode: 'none',
  output: {
    iife: false,
    pathinfo: 'verbose',
    path: path.resolve(__dirname, '../dist/esm'),
    filename: '[name].bundle.js',
  },
  optimization: {
    usedExports: false,
  },
});

compiler.run((err, stat) => {
  if (err) {
    console.log(errr);
  }
  // console.log(stat);
});
