/*
 * @Author: yuzhicheng
 * @Date: 2023-03-03 10:39:24
 * @Last Modified by: yuzhicheng
 * @Last Modified time: 2023-03-09 11:49:55
 */
const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpackDevServer = require('webpack-dev-server');

const compiler = webpack({
  entry: path.resolve(__dirname, '../src/better-hash/index.js'),
  mode: 'none',
  output: {
    clean: true,
    iife: false,
    pathinfo: 'verbose',
    path: path.resolve(__dirname, '../dist/better-hash'),
    filename: 'main.[contenthash].js',
    chunkFilename: '[name].[chunkhash].chunk.js',
    clean: true,
  },
});

const compiler1 = webpack({
  entry: path.resolve(__dirname, '../src/better-hash/index.js'),
  mode: 'none',
  output: {
    clean: true,
    iife: false,
    pathinfo: 'verbose',
    path: path.resolve(__dirname, '../dist/better-hash'),
    filename: 'main.[contenthash].js',
    chunkFilename: '[name].[chunkhash].chunk.js',
    clean: true,
  },
  optimization: {
    // moduleIds: 'deterministic',
    // chunkIds: 'deterministic',
    runtimeChunk: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      // title: 'hot module replacement',
      template: path.resolve(__dirname, '../src/better-hash/index.html'),
    }),
  ],
  devServer: {
    static: path.resolve(__dirname, '../dist/better-hash'),
    hot: true,
  },
});

const applyDevServerCompiler = webpack({
  entry: [path.resolve(__dirname, '../src/better-hash/index.js')],
  mode: 'development',
  devtool: 'inline-source-map',
  output: {
    clean: true,
    iife: false,
    pathinfo: 'verbose',
    path: path.resolve(__dirname, '../dist/better-hash'),
    filename: 'main.[contenthash].js',
    chunkFilename: '[name].[chunkhash].chunk.js',
  },
  // optimization: {
  //   moduleIds: 'deterministic',
  //   chunkIds: 'deterministic',
  //   runtimeChunk: true,
  // },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      // title: 'hot module replacement',
      template: path.resolve(__dirname, '../src/better-hash/index.html'),
    }),
  ],
});

const server = new webpackDevServer(
  {
    // hot: true,
    client: {
      overlay: true,
    },
    static: path.resolve(__dirname, '../dist/better-hash'),
    port: 10001,
    open: true,
  },
  applyDevServerCompiler
);

compiler1.run();

// (async () => {
//   await server.start();
//   console.log('dev server is running');
// })();
