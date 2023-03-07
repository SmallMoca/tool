'use strict';
(self['webpackChunktool'] = self['webpackChunktool'] || []).push([
  [0],
  [
    /* 0 */
    /*!**********************************!*\
  !*** ./src/better-hash/index.js ***!
  \**********************************/
    /*! namespace exports */
    /*! exports [not provided] [no usage info] */
    /*! runtime requirements: __webpack_require__, __webpack_require__.r, __webpack_exports__, __webpack_require__.e, __webpack_require__.* */
    /***/ (
      __unused_webpack_module,
      __webpack_exports__,
      __webpack_require__
    ) => {
      debugger;
      __webpack_require__.r(__webpack_exports__);
      /* harmony import */ var _add__WEBPACK_IMPORTED_MODULE_0__ =
        __webpack_require__(/*! ./add */ 1);
      // import _ from 'lodash';

      // console.log(_.get); // import('lodash');

      __webpack_require__
        .e(/*! import() */ 2)
        .then(__webpack_require__.bind(__webpack_require__, /*! ./sum */ 2))
        .then((m) => {
          console.log(m.default(3, 2));
        });

      (0, _add__WEBPACK_IMPORTED_MODULE_0__['default'])(3, 3);

      // const divs = document.querySelectorAll('div');
      // console.log(divs);
      // Array.from(divs).forEach((div) => (div.innerHTML = 'div'));
      // const HMR = module.hot;
      // HMR && HMR.accept && HMR.accept();

      /***/
    },
    /* 1 */
    /*!********************************!*\
  !*** ./src/better-hash/add.js ***!
  \********************************/
    /*! namespace exports */
    /*! export default [provided] [no usage info] [missing usage info prevents renaming] */
    /*! other exports [not provided] [no usage info] */
    /*! runtime requirements: __webpack_exports__, __webpack_require__.r, __webpack_require__.d, __webpack_require__.* */
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
      // add.js 内容
      const sum = (...args) => args.reduce((x, y) => x + y, 1);

      /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = sum;

      /***/
    },
  ],
  /******/ (__webpack_require__) => {
    // webpackRuntimeModules
    /******/ var __webpack_exec__ = (moduleId) =>
      __webpack_require__((__webpack_require__.s = moduleId));
    /******/ var __webpack_exports__ = __webpack_exec__(0);
    /******/
  },
]);
