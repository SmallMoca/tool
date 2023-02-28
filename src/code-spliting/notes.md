# code spliting

## debugger 理解 `__webpack_require__` 挂载的方法

```JS
'use strict';
(self['webpackChunktool'] = self['webpackChunktool'] || []).push([
  [1],
  [
    ,
    /* 0 */ /* 1 */
    /***/ (
      __unused_webpack_module,
      __webpack_exports__,
      __webpack_require__
    ) => {
      __webpack_require__.r(__webpack_exports__);
      /* harmony export */ __webpack_require__.d(__webpack_exports__, {
        /* harmony export */ default: () => __WEBPACK_DEFAULT_EXPORT__,
        /* harmony export */
      });
      // sum.js 内容
      const sum = (...args) => args.reduce((x, y) => x + y, 0);
      /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = sum;

      /***/
    },
  ],
]);

```

`__webpack_require__.e` :接收一个 chunkId 的参数，根据 chunkId 去加载 chunk 相关资源，Promise.all ，里面是加载 chunk 的 promise`__webpack_require__.f.j`方法

`__webpack_require__.u`:传入 chunkId 拿到 chunk 被 wepack 打包之后的文件名
`__webpack_require__.f.j`:

```js
/**
 *{key:value}
 * key 代表chunkId
 * value: 0 代表该jsonp chunk加载成功 [resolve,rejecet,Promise] 代表该chunk 正在加载中 null:  chunk 为 preloaded/refetched
 * @Desc  用于 javascript 的 JSONP 块加载
 */
var installedChunks = {
  0: 0,
};
__webpack_require__.f.j = (chunkId, promises) => {
  // 根据chunkId 拿到 installedChunks 的value 用于判断 chunk 是否被加载
  //
  var installedChunkData = __webpack_require__.o(installedChunks, chunkId)
    ? installedChunks[chunkId]
    : undefined;
  // installedChunkData 不为0 改chunk 没有被加载成功
  if (installedChunkData !== 0) {
    // 如果installedChunkData 成立 代码一定是 [resolve,rejecet,Promise] 则 改chunk 正在加载 直接
    if (installedChunkData) {
      // 直接 将加载该chunk的promise 放进 promises
      promises.push(installedChunkData[2]);
    } else {
      if (true) {
        // 加载chunk
        // 初始化一个 promise
        var promise = new Promise(
          (resolve, reject) =>
            (installedChunkData = installedChunks[chunkId] = [resolve, reject])
        );
        // 这里 将改chunk 的promise 放入 installedChunkData = [resolve,rejecet,Promise]
        // promises 增加改chunk的 promise
        promises.push((installedChunkData[2] = promise));
        // 拼接 该chunk 资源的路径
        var url = __webpack_require__.p + __webpack_require__.u(chunkId);
        var error = new Error();

        // chunk 脚本被加载成功后执行回调
        var loadingEnded = (event) => {
          // 判断 installedChunkData 是否含有 chunkId 如果有证明 这个是需要加载的chunk
          if (__webpack_require__.o(installedChunks, chunkId)) {
            installedChunkData = installedChunks[chunkId];
            // 如果不为 0 代表 这个脚本加载失败了 状态回正为undefined
            if (installedChunkData !== 0) installedChunks[chunkId] = undefined;
            // 如果 还是 加载中 抛出 该chunk reject 加载错误
            if (installedChunkData) {
              var errorType =
                event && (event.type === 'load' ? 'missing' : event.type);
              var realSrc = event && event.target && event.target.src;
              error.message =
                'Loading chunk ' +
                chunkId +
                ' failed.\n(' +
                errorType +
                ': ' +
                realSrc +
                ')';
              error.name = 'ChunkLoadError';
              error.type = errorType;
              error.request = realSrc;
              installedChunkData[1](error);
            }
          }
        };
        // 真正去加载 chunk 脚本的方法 使用script 标签去加载脚本 使用 __webpack_require__.l方法
        __webpack_require__.l(url, loadingEnded, 'chunk-' + chunkId, chunkId);
      } else installedChunks[chunkId] = 0;
    }
  }
};
```

`__webpack_require__.l`: 使用 script 去加载 chunk 资源脚本

```js
(() => {
  // 用于判断改chunk 脚本是否在加载中
  var inProgress = {};
  var dataWebpackPrefix = 'tool:';
  /**
   *
   * @param {*} url 要加载脚本的路径
   * @param {*} done 脚本加载成功后的回调函数
   * @param {*} key
   * @param {*} chunkId
   * @returns
   */
  __webpack_require__.l = (url, done, key, chunkId) => {
    if (inProgress[url]) {
      inProgress[url].push(done);
      return;
    }
    var script, needAttach;
    if (key !== undefined) {
      var scripts = document.getElementsByTagName('script');
      for (var i = 0; i < scripts.length; i++) {
        var s = scripts[i];
        if (
          s.getAttribute('src') == url ||
          s.getAttribute('data-webpack') == dataWebpackPrefix + key
        ) {
          script = s;
          break;
        }
      }
    }
    if (!script) {
      needAttach = true;
      script = document.createElement('script');

      script.charset = 'utf-8';
      script.timeout = 120;
      // nonce，用以配置 CSP 策略，见 https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
      if (__webpack_require__.nc) {
        script.setAttribute('nonce', __webpack_require__.nc);
      }
      script.setAttribute('data-webpack', dataWebpackPrefix + key);
      script.src = url;
    }
    // 设置chunk 加载完成时的回调回调
    inProgress[url] = [done];
    var onScriptComplete = (prev, event) => {
      // avoid mem leaks in IE.
      script.onerror = script.onload = null;
      clearTimeout(timeout);
      var doneFns = inProgress[url];
      delete inProgress[url];
      script.parentNode && script.parentNode.removeChild(script);
      // 脚本加载结束后，回调 done 函数，并传递 event 参数s
      doneFns && doneFns.forEach((fn) => fn(event));
      if (prev) return prev(event);
    };
    var timeout = setTimeout(
      onScriptComplete.bind(null, undefined, {
        type: 'timeout',
        target: script,
      }),
      120000
    );
    script.onerror = onScriptComplete.bind(null, script.onerror);
    script.onload = onScriptComplete.bind(null, script.onload);
    needAttach && document.head.appendChild(script);
  };
})();
```

## 问题

### 1. 对 code spliting 后的代码进行调试与理解

### 2. 将自己项目取消代码压缩进行打包，观察其打包后的代码骨架

### 3. 在 webpack 中如何实现 code spliting

### 4. 在 webpack 中，加载 chunk 脚本的 JSONP Callback 如何实现

### 5. 当 output.chunkLoading 配置为 import 时，分析其源码

### 6. 当代码分割时，async chunk 所对应的源代码发生变更时，该 async chunk 路径将会发生变化，而 entry chunk 中的`__webpack_require__` 内容也将发生变化，导致 entry chunk 的内容发生变更，随之路径发生变更，这将导致不必要的缓存失效，如何处理该问题。
