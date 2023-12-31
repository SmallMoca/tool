/*
 * @Author: yuzhicheng
 * @Date: 2023-03-15 11:58:53
 * @Last Modified by: yuzhicheng
 * @Last Modified time: 2023-04-14 16:47:48
 */
const WebpackBar = require('webpackbar');
const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpackDevServer = require('webpack-dev-server');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const styleLoader = require('./loader/normal-style-loader');

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
        test: /\.customize\.json?$/,
        use: [
          {
            loader: path.resolve(
              __dirname,
              '../json-loader/loader/json-loader.js'
            ),
          },
        ],
        // 防止 Webpack 5 中默认的 type: 'json' 解析 .json 文件时会出现问题。
        type: 'javascript/auto',
      },
      {
        test: /\.less$/i,
        use: [
          // {
          //   loader: MiniCssExtractPlugin.loader,
          //   options: {
          //     publicPath: '',
          //   },
          // },
          // 'style-loader',
          {
            loader: path.resolve(__dirname, './loader/pitch-style-loader.js'),
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                // 添加 autoprefixer 插件
                plugins: [require('autoprefixer')],
              },
            },
          },
          'less-loader',
        ],
      },
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
      title: 'less loader',
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash:10].css',
      chunkFilename: '[name].[contenthash:10].css',
    }),
  ],
  resolve: {
    extensions: ['.ts', '.js'],
  },
});

const server = new webpackDevServer(
  {
    client: {
      overlay: true,
    },
    port: 10001,
    open: true,
    hot: true,
  },
  compiler
);

(async () => {
  await server.start();
  console.log('dev server is running');
})();

// compiler.run((err) => {
//   console.log(err, 'error log');
// });
