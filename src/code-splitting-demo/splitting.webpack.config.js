/*
 * @Author: yuzhicheng
 * @Date: 2023-03-09 10:52:00
 * @Last Modified by: yuzhicheng
 * @Last Modified time: 2023-03-09 12:24:07
 * @Desc codesplitting
 */

const webpack = require('webpack');
const path = require('path');
const WebpackBar = require('webpackbar');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// 这种多入口方式打包的问题
// 1. 重复模块 都会被引入到各个 bundle 中

// 多入口共享 模块
// 1. 使用webpack  dependOn属性，将多个入口依赖的公共模块指定为同一个 bundle

const multipleCompiler = webpack({
  mode: 'development',
  // 多入口 直接打包 重复模块 会打包重复打包到各个 bundle 中
  entry: {
    index: path.resolve(__dirname, './index.js'),
    another: path.resolve(__dirname, './another-module.js'),
  },

  // 使用dependon属性，将多个入口依赖的公共模块指定为同一个 bundle
  // entry: {
  //   shared: 'lodash',
  //   index: {
  //     import: path.resolve(__dirname, './index.js'),
  //     dependOn: 'shared',
  //   },
  //   another: {
  //     import: path.resolve(__dirname, './another-module.js'),
  //     dependOn: 'shared',
  //   },
  // },
  output: {
    clean: true,
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, '../../dist/code-splitting-demo'),
  },
  optimization: {
    runtimeChunk: 'single',
    // 配置 splitChunks 抽离重复模块
    splitChunks: {
      chunks: 'all',
      name: 'vendors',
    },
  },
  plugins: [
    new WebpackBar({
      profile: true,
      basic: true,
    }),
    new HtmlWebpackPlugin({
      title: 'code splitting',
    }),
  ],
});

multipleCompiler.run((err, stats) => {
  //
  if (err || stats.hasErrors()) {
    console.log('error', err);
    return;
  }

  multipleCompiler.close((closeErr) => {});
});
