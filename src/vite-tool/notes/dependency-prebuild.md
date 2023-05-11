# vite 依赖预构建

我们使用 vite 在开发环境启动开发服务，会使用 esbuild 将依赖打包成一个个支持 esm 模块的文件

## vite 为什么在开发阶段预构建依赖？

1. commonjs 和 umd 兼容性，我们都知道 vite 开发环境是基于 esm 的，但是第三方包并不是都支持 esm，所以我们启动开发环境服务 要将第三方包转换成支持 esm 访问的模块。
2. 提高性能，将有多个 esm 模块碎片化的依赖转化为单个模块，减少 http 请求个数提高页面访问速度
   有些包将 es 模块构建为许多单独的文件，彼此导入，lodash-es 有超过 600 个内置模块！当我们执行 import { debounce } from 'lodash-es' 时，浏览器同时发出 600 多个 HTTP 请求！大量请求会导致浏览器网络堵塞。

## 预构建

- vite 预构建 在 vite 开发环境 自动开启，dev 环境启动之后 ，会将预构建的的产物存放到 node_modules/.vite 目录
- 我们在源码文件中裸模块导入方式依赖模块会被重写为引入预构建产物存放的路径
- 对于依赖产物的资源请求 会被设置为强缓存一年，缓存过的依赖资源不会再经过 vite dev server
  如果
  1. package.json 的 dependency 字段
  2. 包管理器的 lock 文件
  3. vite 配置的 optimizeDeps 配置内容
     这些部分的内容没有改变，将会一直缓存依赖产物文件

## 依赖预构建产物缓存

1. 文件系统缓存
   vite 将预构建依赖产物缓存到 node_modules/.vite 目录，下面几个因素影响是否重新构建依赖产物

   - 包管理器锁文件内容 比如 pnpm-lock.yaml packge-locak.json
   - vite.config.ts 相关相关字段 比如 optimizeDeps
   - NODE_ENV 等值

2. 浏览器缓存
   预构建的依赖产物请求使用 http 请求头 max-age=31536000, immutable 强魂村，提高开发阶段页面加载性能

## vite 依赖优化选项 optimizeDeps
