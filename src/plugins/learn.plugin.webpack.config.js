/*
 * @Author: yuzhicheng
 * @Date: 2023-03-15 11:58:53
 * @Last Modified by: yuzhicheng
 * @Last Modified time: 2023-03-27 15:29:59
 */
const WebpackBar = require('webpackbar');
const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('./plugin/html-webpack-plugin');
const webpackDevServer = require('webpack-dev-server');
const SomePlugin = require('./plugin/some-plugin');

const compiler = webpack({
  entry: path.resolve(__dirname, 'src/index.ts'),
  mode: 'none',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.bundle.js',
    clean: true,
    hashFunction: 'xxhash64',
    filename: 'main.[id].[contenthash].js',
    chunkFilename: '[name].[id].chunk.[contenthash].js',
  },
  optimization: {
    runtimeChunk: {
      name: 'runtime',
    },
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              happyPackMode: true,
              compilerOptions: {
                sourceMap: true,
              },
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new WebpackBar({
      profile: false,
      basic: true,
    }),
    new HtmlWebpackPlugin({
      title: '哈哈哈 ，我写的htmlplugin',
      // title: 'code splitting',
    }),
    new SomePlugin(),
  ],
  resolve: {
    extensions: ['.ts', '.js'],
  },
  devtool: 'source-map',
});

compiler.run();

// const server = new webpackDevServer(
//   {
//     client: {
//       overlay: true,
//     },
//     port: 10001,
//     open: true,
//     hot: true,
//   },
//   compiler
// );

// (async () => {
//   await server.start();
//   console.log('dev server is running');
// })();
