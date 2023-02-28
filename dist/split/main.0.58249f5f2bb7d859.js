(self["webpackChunktool"] = self["webpackChunktool"] || []).push([[0],[
/* 0 */
/*!************************************!*\
  !*** ./src/code-spliting/index.js ***!
  \************************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements: __webpack_require__.e, __webpack_require__, __webpack_require__.* */
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

// index.js 内容
__webpack_require__.e(/*! import() */ 2).then(__webpack_require__.bind(__webpack_require__, /*! ./sum */ 1)).then((m) => {
  console.log(m.default(3, 4));
});

__webpack_require__.e(/*! import() */ 3).then(__webpack_require__.bind(__webpack_require__, /*! ./a */ 2)).then((m) => {
  // console.log(m.default(3, 4));
  m.default();
});

__webpack_require__.e(/*! import() */ 4).then(__webpack_require__.bind(__webpack_require__, /*! ./c */ 3)).then((m) => {
  // console.log(m.default(3, 4));
  m.default();
});


/***/ })
],
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ var __webpack_exports__ = (__webpack_exec__(0));
/******/ }
]);