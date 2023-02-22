var __webpack_modules__ = [
  ,
  (module) => {
    let count = 0;
    module.exports = {
      changeCount: () => {
        count = 10;
      },
      count,
    };
  },
];
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

var __webpack_exports__ = {};
(() => {
  const { count, changeCount } = __webpack_require__(/*! ./sum */ 1);

  console.log(count);
  changeCount();
  console.log(count);
})();
