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

## postcss-loader 作用

- 配合 browserslist 根据 browserlist 配置的目标浏览器 ，自动为 css 添加前缀，转化为兼容目标浏览器 css
- 支持使用最新的 css 语法，转化为向后兼容的 css 代码
- 压缩代码 ，导入 cssnano 插件压缩代码

```js
{
  loader: 'postcss-loader',
   options: {
    postcssOptions: {
      // 添加 autoprefixer 插件
      plugins: [
        require('autoprefixer'),
        // cssnano 压缩代码
        require('cssnano')({
              colormin: { legacy: true },
              core: false,
              zindex: false,
              reduceIdents: false,
              mergeIdents: false,
              discardUnused: { keyframes: false },
            }),
        ],

        // colormin: { legacy: true }：启用兼容性模式，用于在压缩颜色时保留 IE 中的 transparent 关键字，防止在某些情况下出现意外行为。
        // core: false：禁用 cssnano 的默认配置和插件，只使用用户提供的配置和插件。
        // zindex: false：禁用 z-index 优化，以避免可能存在的副作用。
        // reduceIdents: false 和 mergeIdents: false：禁用标识符优化，以避免可能存在的副作用。
        // discardUnused: { keyframes: false }：禁用 keyframes 选择器的删除，以避免在某些情况下出现意外行为。
        },
  },
}
```

## browserslist 作用

通常我们在 packge.json 中配置 browserlist 字段，代表我们需要兼容的目标浏览器，该配置会作用于 babel postcss 等工具，这些工具会根据改配置来自动生成兼容这些目标浏览器的代码。

- babel 中 browserslist 作用域 @babel/preset-env
- postcss-loader 主要作用域 cssnano 和 autopreFixer 插件

## 压缩 css 方式

- postcss-loader 中导入 cssnano 上例
- css-minimizer-webpack-plugin 插件
