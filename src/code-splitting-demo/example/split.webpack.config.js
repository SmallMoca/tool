const webpack = require('webpack');
const path = require('path');
const WebpackBar = require('webpackbar');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const compiler = webpack({
  mode: 'none',
  entry: {
    index: path.resolve(__dirname, './index.js'),
  },

  output: {
    clean: true,
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  // 配置 splitchunks 抽离公共模块
  optimization: {
    splitChunks: {
      // 分包出来之后的chunk 名字
      name: 'common',
      /**
       * splitChunks.chunks 设置splitChunks的作用范围
       * 默认值为 async，表示只对异步加载的模块（async chunk）进行分割
       * 设置为all，表示对同步和异步加载的模块都进行分割
       * 设置为initial，表示只 initial chunk 模块进行分割
       */
      chunks: 'all',
      // 设定引用次数超过 2 的模块才进行分包
      minChunks: 2,
      // 被分包出来的模块的最小大小 如果某些模块小于minSize，就不会被分包出来
      minSize: 0,
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

const compiler1 = webpack({
  mode: 'none',
  entry: {
    index: path.resolve(__dirname, './lodash.index.js'),
  },

  output: {
    clean: true,
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist-lodash'),
  },
  optimization: {
    splitChunks: {
      name: 'vendor',
      chunks: 'initial',
      minChunks: 2,
      minSize: 0,
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

compiler1.run((err, stats) => {
  //
  if (err || stats.hasErrors()) {
    console.log('error', err);
    return;
  }

  compiler.close((closeErr) => {});
});
