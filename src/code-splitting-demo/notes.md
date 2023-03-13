# webpack code splitting

合理的分包有利于 提高页面加载性能
**webpack 默认的三种分包处理**

- initial chunk:entry 模块以及相应子模块打包成 initial chunk
- async chunk：通过 import('./xxx') 导入的异步模块以及相关子模块组成的 async chunk
- runtime chunk：运行时代码抽离成的 runtime chunk 比如 `__webpack_require__` 运行时代码

## `splitChunksPlugin`

`splitChunksPlugin` 的一些能力

- `splitChunksPlugin` 支持我们根据 module 路径，module 被引用次数，chunk 大小、chunk 并发请求数等制定我们的分包策略，通过这些策略我们可以
  - 单独打包某些特定路径的 module 为一个 chunk，比如将 node_modules 我们引用的 module 打包成 vendors chunk
  - 单独打包使用较高的文件为一个 单独的 chunk
- 还提供了 optimization.splitChunks.cacheGroup 概念，用于对不同特点的资源做分组处理，并为这些分组设置更有针对性的分包规则
- SplitChunksPlugin 还内置了 default 与 defaultVendors 两个 cacheGroup，提供一些开箱即用的分包特性：
  - `node_modules` 资源命中 `defaultVendors`规则 并单独打包
  - 只有包体积超过 20kb 才会被单独打包
  - 加载 async chunk 并发请求数不超过 30
  - 记载 initial chunk 并发请求数不超过 30

webpack 实现代码分离的一些方式

- 将公用模块 单独入口引入，要使用该公用模块的入口 配置 dependOn 共享这个公共模块
- 使用 `splitChunksPlugin` 抽离公共模块，该插件已经内置 webpack
- dynamic import
