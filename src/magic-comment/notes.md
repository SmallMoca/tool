# magic-commnet 魔方注释

## 页面资源预加载

我们在页面中要使用 图片 css js 等这些资源 要等待资源下载成功后再执行，我们可以通过让资源预加载，等资源需要使用的时候直接从缓存中取就好了，不必等待网络下载资源的开销
提高首屏响应时间

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
