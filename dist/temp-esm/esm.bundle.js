'use strict';
var __webpack_modules__ = {
  3: (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
    __webpack_require__.r(__webpack_exports__); // 标记为 esm 类型
    __webpack_require__.d(__webpack_exports__, {
      changeCount: () => /* binding */ changeCount,
      count: () => /* binding */ count,
    });
    let count = 0;
    const changeCount = () => {
      // console.log('func');
      count = 10;
    };
  },
};

var __webpack_module_cache__ = {};

function __webpack_require__(moduleId) {
  var cachedModule = __webpack_module_cache__[moduleId];
  if (cachedModule !== undefined) {
    return cachedModule.exports;
  }
  var module = (__webpack_module_cache__[moduleId] = {
    exports: {},
  });

  __webpack_modules__[moduleId](module, module.exports, __webpack_require__);

  return module.exports;
}

(() => {
  __webpack_require__.d = (exports, definition) => {
    for (var key in definition) {
      if (
        __webpack_require__.o(definition, key) &&
        !__webpack_require__.o(exports, key)
      ) {
        Object.defineProperty(exports, key, {
          enumerable: true,
          get: definition[key],
        });
      }
    }
  };
})();

(() => {
  __webpack_require__.o = (obj, prop) =>
    Object.prototype.hasOwnProperty.call(obj, prop);
})();

(() => {
  __webpack_require__.r = (exports) => {
    if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
      Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
    }
    Object.defineProperty(exports, '__esModule', { value: true });
  };
})();

/************************************************************************/
var __webpack_exports__ = {};
(() => {
  __webpack_require__.r(__webpack_exports__);
  /* harmony import */ var _esm__WEBPACK_IMPORTED_MODULE_0__ =
    __webpack_require__(/*! ./esm */ 3);

  console.log(_esm__WEBPACK_IMPORTED_MODULE_0__.count);
  (0, _esm__WEBPACK_IMPORTED_MODULE_0__.changeCount)();
  console.log(_esm__WEBPACK_IMPORTED_MODULE_0__.count);
})();
