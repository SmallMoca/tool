/*
 * @Author: yuzhicheng
 * @Date: 2023-03-15 11:58:53
 * @Last Modified by: yuzhicheng
 * @Last Modified time: 2023-03-20 18:41:51
 */
const WebpackBar = require('webpackbar');
const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpackDevServer = require('webpack-dev-server');
const yaml = require('js-yaml');

const compiler = webpack({
  entry: path.resolve(__dirname, 'src/index.ts'),
  mode: 'none',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.bundle.js',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.json$/,
      },
      {
        test: /\.png$/,
        type: 'asset',
      },
      {
        test: /\.yaml$/,
        type: 'json',
        parser: {
          parse: yaml.load,
        },
      },
      // {
      //   test: /\.customize\.json?$/,
      //   use: [
      //     {
      //       loader: path.resolve(__dirname, './loader/json-loader.js'),
      //     },
      //   ],
      //   // 防止 Webpack 5 中默认的 type: 'json' 解析 .json 文件时会出现问题。
      //   type: 'javascript/auto',
      // },
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
      profile: true,
      basic: true,
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './index.html'),
      // title: 'code splitting',
    }),
  ],
  resolve: {
    extensions: ['.ts', '.js'],
  },
  devtool: 'source-map',
});

const server = new webpackDevServer(
  {
    client: {
      overlay: true,
    },
    static: path.resolve(__dirname, '../dist/better-hash'),
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
