(self["webpackChunktool"] = self["webpackChunktool"] || []).push([[0],[
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* module decorator */ module = __webpack_require__.nmd(module);

Object.defineProperty(exports, "__esModule", ({ value: true }));
__webpack_require__(1);
console.log('style module test');
(function () {
    var home = document.createElement('div');
    home.innerHTML = 'home';
    home.classList.add('home');
    document.body.append(home);
})();
var HMR = module.hot;
HMR && HMR.accept && HMR.accept();


/***/ }),
/* 1 */
/***/ (function() {


function injectCss(css) {
  const style = document.createElement('style')
  style.appendChild(document.createTextNode(css))
  document.head.appendChild(style)
}
injectCss(`// Imports
import ___CSS_LOADER_API_NO_SOURCEMAP_IMPORT___ from "../../../node_modules/.pnpm/css-loader@6.7.3_webpack@5.75.0/node_modules/css-loader/dist/runtime/noSourceMaps.js";
import ___CSS_LOADER_API_IMPORT___ from "../../../node_modules/.pnpm/css-loader@6.7.3_webpack@5.75.0/node_modules/css-loader/dist/runtime/api.js";
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(___CSS_LOADER_API_NO_SOURCEMAP_IMPORT___);
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".home {\n  padding: 20px;\n  margin: 0;\n  font-size: 16px;\n  color: red;\n  display: -webkit-box;\n  display: -webkit-flex;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-pack: center;\n  -webkit-justify-content: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n  height: 40px;\n  -webkit-box-align: center;\n  -webkit-align-items: center;\n      -ms-flex-align: center;\n          align-items: center;\n  background: #999;\n  border-radius: 2px;\n}\n", ""]);
// Exports
export default ___CSS_LOADER_EXPORT___;
`)
  

/***/ })
],
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ var __webpack_exports__ = (__webpack_exec__(0));
/******/ }
]);