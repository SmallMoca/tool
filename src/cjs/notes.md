# cjs 运行时分析

`index.js`

```js
const sum = require('./sum');

// 输出
console.log(sum(3, 8));
```

`sum.js`

```js
module.exports = (...args) => args.reduce((x, y) => x + y, 0);

exports.c = 2;
```

使用`webpack`打包后
`webpack config`

```js
const webpack = require('webpack');
const path = require('path');
const compiler = webpack({
  entry: path.resolve(__dirname, '../src/cjs/index.js'),
  mode: 'none',
  output: {
    iife: false,
    pathinfo: 'verbose',
    path: path.resolve(__dirname, '../dist/cjs'),
  },
});

compiler.run((err, stat) => {
  if (err) {
    console.log(errr);
  }
  console.log(stat);
});
```

`webpack`打包后生成后

`main.js`

```js
// 这个数组维护入口文件引入的所有模块
// 这个数组的生成策略是：更具 入口文件 解析的AST，按深度优先的搜索出所有模块，并构建这个数组

var __webpack_modules__ = [
  ,
  (module, exports) => {
    module.exports = (...args) => args.reduce((x, y) => x + y, 0);

    exports.c = 2;
  },
];
// 模块缓存 执行过的模块 会在这里缓存
var __webpack_module_cache__ = {};

// webpack 模块加载器
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
// 匿名立即执行函数，这里是入口文件 相当于 __webpack_modules__[0],
(() => {
  const sum = __webpack_require__(/*! ./sum */ 1);

  // 输出
  console.log(sum(3, 8));
})();
```

## question?

### webpack cjs 的模块加载器是如何实现的?

webpack 模块加载器 是一个方法，接受一个 moduleId 的参数，在方法内部首先根据这个 moduleId 去缓存中查找是否有该 module 的模块对象，如果有直接返回这个缓存中的模块对象。否则会根据 mouldeId 去`__webpack_modules__`(维护了入口文件引入的所有模块)，查找该模块的 匿名立即执行函数（也有作用 模块隔离，闭包的作用也在这里体现），调用这个方法 得到模块对象，同时缓存该模块对象。

### webpack cjs 运行时代码做了那些事情?

- 维护了一个根据入口文件引入模块生成的索引对象，可以更具 索引 找到对应的模块对象
- 维护了一个 `__webpack_require__` 加载器方法 ，让我们根据索引找到 模块对应的模块对象
- 对加载执行过的模块对象缓存
- 执行入口模块 ，使用 加载器方法`__webpack_require__`加载相关模块导入的对象，然后执行。

### CommonJS 中，如果不对 module 进行缓存有什么问题，即不实现以上的 **webpack_module_cache** 数据结构?

- 保证模块只加载一次
- 缓存对象是用 moudleid 来索引，在 webpack hmr 热加载的可以根据 moudleid 清除缓存和替换新的 module 对象

### 我们在 CommonJS 中使用 module.exports 与 exports 有何区别?

从 运行时代码中可以得到
exports 只是 module.exports 的一个引用
我们引入 cjs 模块的时候映入的 module.exports 对象，
当我们 module.exports 和 exports.x = 'x'时，比如下面这段代码

```js
module.exports = {
  a: 3000,
};

exports.c = 3;
```

引入这个模块得到的是

```
{ a: 3000 }
```

- module.exports 重新指向 新对象
- exports.c 在原有对象的新增 c 属性
- 我们最后得到的是 module.exports 指向的对象

- 总结：我们在使用 cjs 模块的时候 最后只用 exports 或者 module.exports

### 如何理解 webpack 运行时代码最后是 **webpack_require**(0)?

`__webpack_require__(0)` 是入口文件的模块,我们如果运行 该入口文件 ，是先立即执行入口模块 ，所以放到最后相当于 `__webpack_require__(0)`。
所以这里也没有必要再放在 `__webpack_modules` 中，再用 加载器`webpack_require` 再取一遍
