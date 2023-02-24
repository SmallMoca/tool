const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const StatsPlugin = require('stats-webpack-plugin');

const compiler = webpack([
  {
    entry: path.resolve(__dirname, '../src/hash/souce-code.js'),
    mode: 'none',
    profile: true,
    output: {
      clean: true,
      iife: false,
      pathinfo: 'verbose',
      path: path.resolve(__dirname, '../dist/hash'),
      filename: '[name].[contenthash].md4.js',
      hashFunction: 'md4',
    },
    plugins: [
      new StatsPlugin('md4.tats.json', {
        chunkModules: true,
      }),
    ],
  },
  {
    entry: path.resolve(__dirname, '../src/hash/souce-code.js'),
    mode: 'none',
    profile: true,
    output: {
      clean: true,
      iife: false,
      pathinfo: 'verbose',
      path: path.resolve(__dirname, '../dist/hash'),
      filename: '[name].[contenthash].xxhash64.js',
      hashFunction: 'xxhash64',
    },
    plugins: [
      new StatsPlugin('xxhash64.tats.json', {
        chunkModules: true,
      }),
    ],
  },
]);

compiler.run((err, stat) => {
  if (err) {
    console.log(errr);
  }

  // console.log(stat);
  stat.stats.map((stat, index) => {
    console.log(
      `第${index + 1}次打包, 打包时间: ${stat.endTime - stat.startTime}`
    );
  });
});
