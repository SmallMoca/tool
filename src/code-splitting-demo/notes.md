# webpack code splitting

合理的分包有利于 提高页面加载性能
**webpack 默认的三种分包处理**

- initial chunk:entry 模块以及相应子模块打包成 initial chunk
- async chunk：通过 import('./xxx') 导入的异步模块以及相关子模块组成的 async chunk
- runtime chunk：运行时代码抽离成的 runtime chunk 比如 `__webpack_require__` 运行时代码

## `splitChunksPlugin`

webpack 实现代码分离的一些方式

- 将公用模块 单独入口引入，要使用该公用模块的入口 配置 dependOn 共享这个公共模块
- 使用 `splitChunksPlugin` 抽离公共模块，该插件已经内置 webpack
- dynamic import
