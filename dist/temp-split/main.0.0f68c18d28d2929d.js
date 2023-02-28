/******/ var __webpack_modules__ = {};
/************************************************************************/
/******/ // The module cache
/******/ var __webpack_module_cache__ = {};
/******/
/******/ // The require function
/******/ function __webpack_require__(moduleId) {
  /******/ // Check if module is in cache
  /******/ var cachedModule = __webpack_module_cache__[moduleId];
  /******/ if (cachedModule !== undefined) {
    /******/ return cachedModule.exports;
    /******/
  }
  /******/ // Create a new module (and put it into the cache)
  /******/ var module = (__webpack_module_cache__[moduleId] = {
    /******/ // no module.id needed
    /******/ // no module.loaded needed
    /******/ exports: {},
    /******/
  });
  /******/
  /******/ // Execute the module function
  /******/ __webpack_modules__[moduleId](
    module,
    module.exports,
    __webpack_require__
  );
  /******/
  /******/ // Return the exports of the module
  /******/ return module.exports;
  /******/
}
/******/
/******/ // 管理全部模块的变量挂载到 __webpack_require_.m
/******/ __webpack_require__.m = __webpack_modules__;
/******/
/************************************************************************/
/******/ /* webpack/runtime/define property getters */
/******/ (() => {
  /******/ // define getter functions for harmony exports
  /******/ __webpack_require__.d = (exports, definition) => {
    /******/ for (var key in definition) {
      /******/ if (
        __webpack_require__.o(definition, key) &&
        !__webpack_require__.o(exports, key)
      ) {
        /******/ Object.defineProperty(exports, key, {
          enumerable: true,
          get: definition[key],
        });
        /******/
      }
      /******/
    }
    /******/
  };
  /******/
})();
/******/
(() => {
  /******/ __webpack_require__.f = {};
  /******/ __webpack_require__.e = (chunkId) => {
    /******/ return Promise.all(
      Object.keys(__webpack_require__.f).reduce((promises, key) => {
        // TODO __webpack_require__.f.j
        // 实际上是调用 __webpack_require__f.j函数
        /******/ __webpack_require__.f[key](chunkId, promises);
        /******/ return promises;
        /******/
      }, [])
    );
  };
})();
/******/
/******/ /* webpack/runtime/get javascript chunk filename */
/******/ (() => {
  /******/ // This function allow to reference async chunks
  // 根据 chunkId得到chunk 的相关资源地址
  /******/ __webpack_require__.u = (chunkId) => {
    /******/ // return url for filenames based on template
    //TODO 记住，这里的 chunk 脚本的地址被写死，意味着每当 chunk 的文件名发生改变，运行时代码也会发生改变
    /******/ return (
      '' + chunkId + '.' + chunkId + '.chunk.' + '0d65a91fec4eeafa' + '.js'
    );
    /******/
  };
  /******/
})();
/******/
// 封装全局变量
/******/ (() => {
  /******/ __webpack_require__.g = (function () {
    /******/ if (typeof globalThis === 'object') return globalThis;
    /******/ try {
      /******/ return this || new Function('return this')();
      /******/
    } catch (e) {
      /******/ if (typeof window === 'object') return window;
      /******/
    }
    /******/
  })();
  /******/
})();
/******/
/******/ /* webpack/runtime/hasOwnProperty shorthand */
/******/ (() => {
  /******/ __webpack_require__.o = (obj, prop) =>
    Object.prototype.hasOwnProperty.call(obj, prop);
  /******/
})();
/******/
/******/ /* webpack/runtime/load script */
// 这里是webpack运行时 加载chunk 资源的脚本
/******/ (() => {
  /******/ var inProgress = {};
  /******/ var dataWebpackPrefix = 'tool:';
  /******/ // loadScript function to load a script via script tag

  /******/ __webpack_require__.l = (url, done, key, chunkId) => {
    debugger;
    // done 为脚本完成时的回调函数
    /******/ if (inProgress[url]) {
      inProgress[url].push(done);
      return;
    }
    // 使用script标签加载chunk js 脚本
    /******/ var script, needAttach;
    /******/ if (key !== undefined) {
      /******/ var scripts = document.getElementsByTagName('script');
      /******/ for (var i = 0; i < scripts.length; i++) {
        /******/ var s = scripts[i];
        /******/ if (
          s.getAttribute('src') == url ||
          s.getAttribute('data-webpack') == dataWebpackPrefix + key
        ) {
          script = s;
          break;
        }
        /******/
      }
      /******/
    }
    /******/ if (!script) {
      /******/ needAttach = true;
      /******/ script = document.createElement('script');
      /******/
      /******/ script.charset = 'utf-8';
      /******/ script.timeout = 120;
      // nonce，用以配置 CSP 策略，见 https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
      /******/ if (__webpack_require__.nc) {
        /******/ script.setAttribute('nonce', __webpack_require__.nc);
        /******/
      }
      /******/ script.setAttribute('data-webpack', dataWebpackPrefix + key);
      /******/ script.src = url;
      /******/
    }
    // 设置chunk 加载完成时的回调回调
    /******/ inProgress[url] = [done];
    /******/ var onScriptComplete = (prev, event) => {
      /******/ // avoid mem leaks in IE.
      /******/ script.onerror = script.onload = null;
      /******/ clearTimeout(timeout);
      /******/ var doneFns = inProgress[url];
      /******/ delete inProgress[url];
      /******/ script.parentNode && script.parentNode.removeChild(script);
      // 脚本加载结束后，回调 done 函数，并传递 event 参数s
      /******/ doneFns && doneFns.forEach((fn) => fn(event));
      /******/ if (prev) return prev(event);
      /******/
    };
    /******/ var timeout = setTimeout(
      onScriptComplete.bind(null, undefined, {
        type: 'timeout',
        target: script,
      }),
      120000
    );
    /******/ script.onerror = onScriptComplete.bind(null, script.onerror);
    /******/ script.onload = onScriptComplete.bind(null, script.onload);
    /******/ needAttach && document.head.appendChild(script);
    /******/
  };
  /******/
})();
/******/
/******/ /* webpack/runtime/make namespace object */
/******/ (() => {
  /******/ // define __esModule on exports
  /******/ __webpack_require__.r = (exports) => {
    /******/ if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
      /******/ Object.defineProperty(exports, Symbol.toStringTag, {
        value: 'Module',
      });
      /******/
    }
    /******/ Object.defineProperty(exports, '__esModule', { value: true });
    /******/
  };
  /******/
})();
/******/
/******/ /* webpack/runtime/publicPath */
/******/ (() => {
  /******/ var scriptUrl;
  /******/ if (__webpack_require__.g.importScripts)
    scriptUrl = __webpack_require__.g.location + '';
  /******/ var document = __webpack_require__.g.document;
  /******/ if (!scriptUrl && document) {
    /******/ if (document.currentScript)
      /******/ scriptUrl = document.currentScript.src;
    /******/ if (!scriptUrl) {
      /******/ var scripts = document.getElementsByTagName('script');
      /******/ if (scripts.length) scriptUrl = scripts[scripts.length - 1].src;
      /******/
    }
    /******/
  }
  /******/ // When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
  /******/ // or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
  /******/ if (!scriptUrl)
    throw new Error('Automatic publicPath is not supported in this browser');
  /******/ scriptUrl = scriptUrl
    .replace(/#.*$/, '')
    .replace(/\?.*$/, '')
    .replace(/\/[^\/]+$/, '/');
  /******/ __webpack_require__.p = scriptUrl;
  /******/
})();
/******/
/******/ /* webpack/runtime/jsonp chunk loading */
/******/ (() => {
  /******/ // no baseURI
  /******/
  /******/ // object to store loaded and loading chunks
  /******/ // undefined = chunk not loaded, null = chunk preloaded/prefetched
  /******/ // [resolve, reject, Promise] = chunk loading, 0 = chunk loaded

  var installedChunks = {
    /******/ 0: 0,
    /******/
  };
  /******/
  /******/ __webpack_require__.f.j = (chunkId, promises) => {
    /******/ // JSONP chunk loading for javascript
    /******/ var installedChunkData = __webpack_require__.o(
      installedChunks,
      chunkId
    )
      ? installedChunks[chunkId]
      : undefined;
    /******/ if (installedChunkData !== 0) {
      // 0 means "already installed".
      /******/
      /******/ // a Promise means "currently loading".
      /******/ if (installedChunkData) {
        /******/ promises.push(installedChunkData[2]);
        /******/
      } else {
        /******/ if (true) {
          // all chunks have JS
          /******/ // setup Promise in chunk cache
          /******/ var promise = new Promise(
            (resolve, reject) =>
              (installedChunkData = installedChunks[chunkId] =
                [resolve, reject])
          );
          /******/ promises.push((installedChunkData[2] = promise));
          /******/
          /******/ // start chunk loading
          /******/ var url =
            __webpack_require__.p + __webpack_require__.u(chunkId);
          /******/ // create error before stack unwound to get useful stacktrace later
          /******/ var error = new Error();
          /******/ var loadingEnded = (event) => {
            debugger;
            /******/ if (__webpack_require__.o(installedChunks, chunkId)) {
              /******/ installedChunkData = installedChunks[chunkId];
              /******/ if (installedChunkData !== 0)
                installedChunks[chunkId] = undefined;
              /******/ if (installedChunkData) {
                /******/ var errorType =
                  event && (event.type === 'load' ? 'missing' : event.type);
                /******/ var realSrc =
                  event && event.target && event.target.src;
                /******/ error.message =
                  'Loading chunk ' +
                  chunkId +
                  ' failed.\n(' +
                  errorType +
                  ': ' +
                  realSrc +
                  ')';
                /******/ error.name = 'ChunkLoadError';
                /******/ error.type = errorType;
                /******/ error.request = realSrc;
                /******/ installedChunkData[1](error);
                /******/
              }
              /******/
            }
            /******/
          };
          /******/ __webpack_require__.l(
            url,
            loadingEnded,
            'chunk-' + chunkId,
            chunkId
          );
          /******/
        } else installedChunks[chunkId] = 0;
        /******/
      }
      /******/
    }
    /******/
  };
  /******/
  /******/ // no prefetching
  /******/
  /******/ // no preloaded
  /******/
  /******/ // no HMR
  /******/
  /******/ // no HMR manifest
  /******/
  /******/ // no on chunks loaded
  /******/
  // jsonp 回调 给加载的 async chunk 调用,传递模块对象
  var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
    debugger;
    var [chunkIds, moreModules, runtime] = data;

    var moduleId,
      chunkId,
      i = 0;
    if (chunkIds.some((id) => installedChunks[id] !== 0)) {
      for (moduleId in moreModules) {
        if (__webpack_require__.o(moreModules, moduleId)) {
          // 加载的模块收集到 __webpack_modules__
          __webpack_require__.m[moduleId] = moreModules[moduleId];
        }
      }
      if (runtime) var result = runtime(__webpack_require__);
    }
    //
    if (parentChunkLoadingFunction) parentChunkLoadingFunction(data);
    for (; i < chunkIds.length; i++) {
      chunkId = chunkIds[i];
      if (
        __webpack_require__.o(installedChunks, chunkId) &&
        installedChunks[chunkId]
      ) {
        // 执行相关async chunk promise 的resolve
        installedChunks[chunkId][0]();
      }
      // 标记 该async chunk是加载成功的
      installedChunks[chunkId] = 0;
    }
  };
  /******/
  var chunkLoadingGlobal = (self['webpackChunktool'] =
    self['webpackChunktool'] || []);
  chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
  chunkLoadingGlobal.push = webpackJsonpCallback.bind(
    null,
    chunkLoadingGlobal.push.bind(chunkLoadingGlobal)
  );
})();
/******/
/************************************************************************/
var __webpack_exports__ = {};
/*!************************************!*\
  !*** ./src/code-spliting/index.js ***!
  \************************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements: __webpack_require__.e, __webpack_require__, __webpack_require__.* */
// index.js 内容
debugger;
__webpack_require__
  .e(/*! import() */ 1)
  .then(__webpack_require__.bind(__webpack_require__, /*! ./sum */ 1))
  .then((m) => {
    console.log(m.default(3, 4));
  });
