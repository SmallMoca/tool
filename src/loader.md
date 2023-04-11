# webpack loader

`loader` 和 `plugin` 是两种主流扩展 `webpack` 的方式。

- `loader`: 主要负责将资源内容翻译成 `webpack` 能理解的 JavaScript 模块。（`webpack5` 后，扩展了 parse 对象，webpack 默认已经支持 图片 json 等资源模块）
- `plugin`；深入接入 webpack 构建，重塑构建逻辑，比较复杂。

## loader

**webpack 为什么单独设计 loader 扩展方式?**
为了解耦，计算机的文件格式太多 webpack 不可能为每种文件格式都提供解析处理能力，所以 webpack 通过提供 loader 这一扩展方式 将解析处理资源的能力提供出去，让第三方开发者，社区去丰富 webpack 的解析资源能力。

**loader 的基本形态**
loader 的基本形态是一个接受 source sourcemap meta 三个参数的函数

```ts
module.exports = function (source, sourceMap?, data?) {
  return source;
};
```

**函数参数**
`source`: 资源输入，如果是第一个执行的 loader ，source 为资源的文本内容，后续执行的 loader 则为上一个 loader 返回的结果，可能是字符串 也可能是 ast 结构等
`sourceMap`:可选参数，代码的 sourcemap 结构
`data`?: 可选参数，其他需要在 loader 链中传递的信息，
