# webpack loader

`loader` 和 `plugin` 是两种主流扩展 `webpack` 的方式。

- `loader`: 主要负责将资源内容翻译成 `webpack` 能理解的 JavaScript 模块。（`webpack5` 后，扩展了 parse 对象，webpack 默认已经支持 图片 json 等资源模块）
- `plugin`；深入接入 webpack 构建，重塑构建逻辑，比较复杂。

## loader

**webpack 为什么单独设计 loader 扩展方式?**
为了解耦，计算机的文件格式太多 webpack 不可能为每种文件格式都提供解析处理能力，所以 webpack 通过提供 loader 这一扩展方式 将解析处理资源的能力提供出去，让第三方开发者，社区去丰富 webpack 的解析资源能力。

**loader 的基本形态**
