/*
 * @Author: yuzhicheng
 * @Date: 2023-04-18 11:23:32
 * @Last Modified by: yuzhicheng
 * @Last Modified time: 2023-04-20 10:46:37
 */
const WebpackBar = require('webpackbar');
const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpackDevServer = require('webpack-dev-server');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const NODE_ENV = process.env.NODE_ENV || 'development';
const IS_DEV = NODE_ENV === 'development';

const compiler = webpack({
  entry: path.resolve(__dirname, 'src/index.tsx'),
  mode: IS_DEV ? 'development' : 'production',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.bundle.js',
    clean: true,
    hashFunction: 'xxhash64',
    filename: 'main.[id].[contenthash].js',
    chunkFilename: '[name].[id].chunk.[contenthash].js',
    publicPath: '/',
  },
  optimization: {
    runtimeChunk: {
      name: 'runtime',
    },
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          'style-loader',
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
                plugins: [require('autoprefixer')],
              },
            },
          },
        ],
      },
      {
        test: /\.less$/i,
        use: [
          'style-loader',
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
                plugins: [require('autoprefixer')],
              },
            },
          },
          'less-loader',
        ],
      },
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              configFile: path.resolve(__dirname, './babel.config.js'),
            },
          },
          {
            loader: 'ts-loader',
            options: {
              //如果设置了 happyPackMode 为 true 会隐式的设置 transpileOnly: true
              happyPackMode: true,
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
    IS_DEV &&
      new HtmlWebpackPlugin({
        // title: 'less loader',
        template: path.join(__dirname, './public/index.html'),
      }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash:10].css',
      chunkFilename: '[name].[contenthash:10].css',
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
    }),
    new ForkTsCheckerWebpackPlugin({
      async: false,
      typescript: {
        configFile: path.resolve(__dirname, './tsconfig.json'),
      },
      logger: {
        // Customize the output to your liking
        issues: (issues) => {
          issues.forEach((issue) => {
            if (issue.severity === 'warning') {
              console.warn(issue.toString());
            } else {
              console.error(issue.toString());
            }
          });
        },
      },
    }),
    IS_DEV &&
      new ReactRefreshWebpackPlugin({
        overlay: {
          sockIntegration: 'whm',
        },
      }),
  ].filter(Boolean),
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    // modules: [path.resolve(__dirname, 'src'), 'node_modules'],
  },
  devtool: IS_DEV ? 'source-map' : undefined,
});

const server = new webpackDevServer(
  {
    client: {
      overlay: false,
      progress: false,
    },
    port: 10001,
    open: true,
    hot: true,
    historyApiFallback: true,
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
