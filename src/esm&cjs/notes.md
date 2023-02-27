# cjs & esm

## 什么是 cjs/esm

**commonJs**
`commonjs`是 node 中的模块规范，通过 require 进行模块导入 module.exports 进行模块导出
`commonjs`可以在 node 环境下使用，但是不能直接在浏览器中使用

> 在我们现在的工程中能使用 commonjs 是借助了 webpack rollup 等工具进行了代码打包
> `commonjs` 是动态导入，比如可以 `require` 一个变量

```js
require('/${A}');
```

**esm**
`esm` 属于语言层面的规范，在浏览器和 node 都被支持

- node 中使用 esm 模块，需要在 package.json 中声明 `type` 字段为 `module` 或者 `.mjs`拓展名
- 浏览器直接导入,需要在 `script` 设置 type="module"属性，相当于默认加上 defer 属性

```html
<script src="./esm/index.js" type="module"></script>
<script type="module">
  console.log(this);
  import { log } from './esm/log.js';
  log('123');
</script>
<script>
  console.log(this);
</script>
```

- esm 模块在模块作用域 this 指向 undefined
- esm 导出导入 有两种方式
  1、具名导入导入
  2、默认导出导入

- esm 为静态导入 在编译的时候可以利用这个特点进行 tree shaking
- 同时也支持 动态导入 比如 使用`import('https://cdn.jsdelivr.net/npm/array-uniq/index.js')` ，

```html
<script type="module">
  // (async() => {})()
  const esm = await import('https://cdn.jsdelivr.net/npm/array-uniq/index.js');
  const arrUniq = esm.default;
  console.log(arrUniq([1, 2, 3, 444, 4, 4, 4]));
</script>
```

## 2. 什么是 import(module)

esm 的动态导入

## 3. 了解 skypack 和 jsdeliver 两个 npm 的 cdn 网站

致力于 cjs 模块向 esm 的转化的产商

# esm to cjs

## 1. 对含 ESM 模块的 webpack 运行时代码进行调试与理解

略

## 2. webpack 含 ESM 的运行时代码做了那些事情

esm 运行时在模块管理和模块对象加载与 cjs 相似，不同在模块对象的处理上

- esm 模块的模块对象 会被标记成 esm 模块
- 导出的模块对象 module.exports 会使用 object.defineProperty 定义 exports 属性，而不是直接使用 对象赋值的方式

## 3. **webpack_require** 中的 d/r/o 各个变量指什么意思

- `__webpack_require__.d`: 使用 object.defineProperty 定义 exports 导出的属性，这里我理解使用 object.defineProperty 来导出有两个方面原因

1. 使用了 setter/getter 懒加载特性 等到需要数据后再进行计算。
2. object.defineProperty 定义 属性用的时候一个方法，改变模块内的属性，能一直拿到改变后的值，符合 esm 规范特性

- `__webpack_require__.r`
  标记为 esm 模块，

  r 函数这段代码是将模块对象标记为 esm 模块

  ```js
  Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
  ```

  我们在判断变量类型的时候可以使用

  ```js
  Object.prototype.toString.call(exports); // 结果是 [object Module]
  ```

- 这和我们直接在浏览器中使用 esm 是一样，可以使用 Object.prototype.toString.call(esm) 来判断是否是 esm 模块

  ```js
  const esm = await import('https://cdn.jsdelivr.net/npm/array-uniq/index.js');
  console.log(Object.prototype.toString.call(esm)); // [object Module]
  ```

- `__webpack_require__.o`
  避免重复复制
