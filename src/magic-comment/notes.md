# magic-commnet 魔方注释

## 页面资源预加载 preload&prefetch

作用：辅助浏览器优化资源加载顺序和时机，提升页面性能

### preload 提前加载

```html
<!-- 使用 link 标签静态标记需要预加载的资源 -->
<link rel="preload" href="/path/to/style.css" as="style" />
```

浏览器解析到这段代码时候会立即去加载这个资源 但是不执行，等需要真正执行这段代码之后再从缓存中取出执行

### prefetch 预判加载

他的作用是浏览器未来可能会使用到某个资源，浏览器在空闲时再去加载对应资源

## 1. 在 webpack 中有哪些魔法注释

`/* webpackPrefetch: true */`
`/* webpackPreLoad: true */`
`/* webpackChunkName: 'sum' */`

## 2. 在 webpack 中如何实现 prefetch 的

- 使用`/* webpackPrefetch: true */` 标记 import('X') 动态模块 进行 chunk prefetch

## 3. 阅读 prefetch 后的运行时代码进行理解##

使用 createElement 创建 link 标签 设置 rel 属性 为 prefetch 插入到 html head 中

```js
/******/ __webpack_require__.F.j = (chunkId) => {
  /******/ if (
    (!__webpack_require__.o(installedChunks, chunkId) ||
      installedChunks[chunkId] === undefined) &&
    true
  ) {
    /******/ installedChunks[chunkId] = null;
    /******/ var link = document.createElement('link');
    /******/
    /******/ if (__webpack_require__.nc) {
      /******/ link.setAttribute('nonce', __webpack_require__.nc);
      /******/
    }
    /******/ link.rel = 'prefetch';
    /******/ link.as = 'script';
    /******/ link.href = __webpack_require__.p + __webpack_require__.u(chunkId);
    /******/ document.head.appendChild(link);
    /******/
  }
  /******/
};
```

## Preload 和 Prefetch 的具体实践

### 案例 1

打开弹窗显示一张图片，在弹窗打开的同时去加载图片，这时候如果图片较大或者网络卡顿的情况下明显看见有一个缓慢加载的过程。

在 index.html 硬编码 prefetch 这个资源

```pug
link(rel="prefetch" as="image"
href="https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7bc218672a02446d9fc6d132589d071d~tplv-k3u1fbpfcp-zoom-crop-mark:3024:3024:3024:1702.png")
```

or

```html
<link
  rel="prefetch"
  as="image"
  href="https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7bc218672a02446d9fc6d132589d071d~tplv-k3u1fbpfcp-zoom-crop-mark:3024:3024:3024:1702.png"
/>
```

我们进入页面再打开这个弹窗，图片是第一时间显示
newwork 查看 我们点击弹窗的时候 ，图片资源是从 prefetch catch 中获取的，

这种硬编码 在我们实际开发中不方便，很多时候我们的图片资源名 是我们构建生成的。

其他方案
手动 new Image().src='X' 在页面页面渲染的时候去加载图片 ，点击时弹窗的时候 图片就拿缓存的图片资源

```js
const prefetchImage = new Image();
React.useEffect(() => {
  prefetchImage.src = require('../test.png');
}, []);
```

使用`preload-webpack-plugin` 插件

其他案例

- 弹窗 或者是 子页含有 echarts 图表 chunk 的资源 使用 `webpackPrefetch` 优化加载 echarts 资源
- prefetch 货值 preload 优化加载字体资源，有时候我们要使用特殊字体，打开页面 明显看见抖动，可使用这个方式优化加载字体资源的时机

总结：合理利用 prefetch /preload 不合理使用有反作用 ，影响我们的网络带宽
