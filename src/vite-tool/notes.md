# vite

## vite 样式解决方案配置

### 样式方案的意义

- 提升开发体验，比如原生 css 不支持选址器嵌套
- 解决样式污染问题 css modules 是 vite 提供的开箱即用的功能
- 浏览器前缀兼容问题 ，postcss 工具帮我们自动处理 css 前缀的问题
- 打包后的代码体积问题

### vite 中使用 css 预处理器

vite 对 css 预处理器语言做了内置支持，零配置即可使用

### vite 中 配置 css modules

vite 中 css modules 是开箱即用的功能。Vite 会对后缀带有.module 的样式文件自动应用 CSS Modules

### vite 中 PostCSS 配置

```ts
css: {
    modules: {
      generateScopedName: '[local]__[hash:base64:5]',
      localsConvention: 'camelCaseOnly',
    },
    postcss: {
      plugins: [
        autoprefixer({
          overrideBrowserslist: [
            'last 2 versions',
            '> 1%',
            'iOS 7',
            'last 3 iOS versions',
          ],
        }),
      ],
    },
  },
```

## vite 依赖预构建
