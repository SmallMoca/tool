const webpack = require('webpack');
const path = require('path');
const WebpackBar = require('webpackbar');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const compiler = webpack({
  mode: 'none',
  entry: {
    entryA: path.resolve(__dirname, './entry-a.js'),
    entryB: path.resolve(__dirname, './entry-b.js'),
    entryC: path.resolve(__dirname, './entry-c.js'),
  },

  output: {
    clean: true,
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  // 配置 splitchunks 抽离公共模块
  optimization: {
    splitChunks: {
      name: 'common',
      chunks: 'all',
      minChunks: 2,
      minSize: 0,
    },
  },
  plugins: [
    new WebpackBar({
      profile: true,
      basic: true,
    }),
  ],
});

compiler.run((err, stats) => {
  //
  if (err || stats.hasErrors()) {
    console.log('error', err);
    return;
  }

  compiler.close((closeErr) => {});
});
