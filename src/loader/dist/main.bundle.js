/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */
/***/ (function() {


/*
 * @Author: yuzhicheng
 * @Date: 2023-03-15 11:50:41
 * @Last Modified by: yuzhicheng
 * @Last Modified time: 2023-03-15 12:49:58
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function mockFetch(params) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ data: params });
        }, 1000);
    });
}
(() => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield mockFetch({ name: 'yuzhicheng', age: 18 });
    console.log(data);
}))();
var Item;
(function (Item) {
    Item["A"] = "A";
})(Item || (Item = {}));


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__[0]();
/******/ 	
/******/ })()
;
//# sourceMappingURL=main.bundle.js.map