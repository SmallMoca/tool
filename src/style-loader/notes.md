# webpack 中简单的样式处理

- css-loader 将 css 转换为 webpack 识别的等价的 js 字符串，相当于 module.exports = `${css}`
- style-loader 一般用于开发环境 将 css 注入 style 标签，相当于提供开发环境的 css 运行时
- postcss-loader 将较新的 css 特性转化为向后兼容的 css 代码
- mini-css-extract-plugin 生产提取 css 为单独的文件
- less-loader 样式预处理器 ，将 less 转化为 css

**开发、生产的 loader 配置**

```js
// dev
module: {
  rules: [
    {
      test: /\.less$/i,
      use: ['style-loader', 'css-loader', 'postcss-loader', 'less-loader'],
    },
  ];
}
// prod
module: {
  rules: [
    {
      test: /\.less$/i,
      use: [
        MiniCssExtractPlugin.loader,
        'css-loader',
        'postcss-loader',
        'less-loader',
      ],
    },
  ];
}
plugins: {
  new MiniCssExtractPlugin({
    filename: '[name].[contenthash:10].css',
    chunkFilename: '[name].[contenthash:10].css',
  });
}
```

## style-loader 和 mini-css-extract-plugin

- 开发环境 使用 style-loader 将样式代码注入 style 标签
  试用于开发环境，不适用于生产环境
  1. css 和 js 打包在一起 任意一个变化 都会导致缓存失效
  2. js、css 资源无法并行加载，加载性能下降
- 生产环境 使用 mini-css-extract-plugin 将样式代码抽离到单独产物文件中，并以 link 标签方式引入 页面中
  注意点
  1. mini-css-extract-plugin 库同时提供 plugin 和 loader 模块，需要同时使用
  2. mini-css-extract-plugin 需要与 html-webpack-plugin 同时使用，才能将产物路径以 link 方式插入 html 中

## postcss-loader
