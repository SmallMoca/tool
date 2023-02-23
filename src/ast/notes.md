# cjs 模块收集与 ast

## 什么是 ast

AST 翻译过来就是抽象语法树。我们通常要把高级语言转到低级语言用的编译器 compiler 就是基于 ast，比如 ts 转 js es6+ 转 es5 生成 soucemap 等，甚至是 eslint 类型检查 代码高亮也和 ast 相关。
为什么转译器需要 ast？
我们代码是按各个语言语法格式组织起来的字符串，人认识 ，计算不认识，想让计算机转译成另外一种语法格式的代码，就必须将源码字符串抽象成一种特殊的数据结构，通过数据结构描述源码，这个特殊数据结构就是 AST.
转换成 ast ，在 ast 数据结构中也会省略源码中无具体意义的风格符，; {} 等，所以这也“抽象”语法树的原因

## ast 生成的三个过程

- parse:parse 的过程就是将源码转换成 AST ,这个过程分为词法分析、语法分析
- transform： 对上一步转换出来的 AST 遍历处理 增删改查 返回新的 ast
- generate 对一步处理过的 AST 转换成目标代码

## parse 阶段的 词法分析 和语法分析

### 词法分析

就是把代码分成一个个不能细分的单词（token）,这个过程叫做词法分析，比如

```js
let age = 14;
```

就是分成 let , age , = , 14, ;,
数据结构描述类似这种

```js
[
  ...
  { type: { ... }, value: "age", start: 0, end: 1, loc: { ... } },
  { type: { ... }, value: "=", start: 2, end: 3, loc: { ... } },
  { type: { ... }, value: "14", start: 4, end: 5, loc: { ... } },
  ...
]
```

词法分析的 token 流 应用：

1. 代码检查，如 eslint 判断是否以分号结尾，判断末尾是否含有分号的 token
2. 语法高亮，如 highlight/prism 使之代码高亮
3. 模板语法，如 ejs 等模板也离不开

### 语法分析

语法分析将 Token 流转化为结构化的 AST，方便操作
[astexplorer](https://astexplorer.net/),查看各个解析器生成的 ast

### webpack 根据入口文件搜索出所有需要打包的模块 实现

简单 js 实现 深度优先

```js
const fs = require('fs');
const path = require('path');

let reg1 = /(?<=require\(\')(.+?)(?=\'\))/g;

const matchFileRequireFiles = (str, curPath) => {
  const matchs = str.match(reg1);
  if (matchs) {
    return matchs.map((item) => path.resolve(curPath, `${item}.js`));
  }
  return [];
};

const readFileToString = (filePath) => {
  try {
    const buffer = fs.readFileSync(filePath);
    return buffer.toString();
  } catch (error) {
    return undefined;
  }
};
const modules = [];
function entry(filePath) {
  modules.push(filePath);
  const str = readFileToString(filePath);
  const selfRequireFiles = matchFileRequireFiles(
    str,
    path.resolve(filePath, '..')
  );
  if (selfRequireFiles.length) {
    selfRequireFiles.forEach((filePath) => {
      entry(filePath);
    });
  }
}

entry(path.resolve(__dirname, '../cjs/index.js'));

console.log(modules);
```

可得

```js
[
  'D:\\self\\tool\\src\\cjs\\index.js',
  'D:\\self\\tool\\src\\cjs\\sum.js',
  'D:\\self\\tool\\src\\cjs\\log.js',
  'D:\\self\\tool\\src\\cjs\\module\\index.js',
  'D:\\self\\tool\\src\\cjs\\module\\a.js',
  'D:\\self\\tool\\src\\cjs\\util.js',
];
```

### 如何去除代码中的所有 console.log

实现的基本原理 ，源码编译成 ast ,遍历 ast 语法树，判断是 consoe.log 节点，删除节点，然后生成目标代码

使用 babel 来实现
创建一个 soucecode.js 源码文件

```js
const name = '123';
function func(a, b) {
  const v = a + b;
  console.log(v);
  return v;
}
const value = func(1, 2);
console.log(value);
```

```js
const parser = require('@babel/parser');
const fs = require('fs');
const path = require('path');
const traverse = require('@babel/traverse').default;
const types = require('@babel/types');
const generator = require('@babel/generator').default;

const readFileToString = (filePath) => {
  try {
    const buffer = fs.readFileSync(filePath);
    return buffer.toString();
  } catch (error) {
    return undefined;
  }
};
const sourceCode = readFileToString(path.resolve(__dirname, './sourcecode.js'));
const AST = parser.parse(sourceCode);
// console.log(AST);

// 使用traverse 来遍历AST
traverse(AST, {
  // 我们针对ast中调用表达式的节点
  CallExpression: function (path) {
    // 判断条件
    /**
     * 1. 该表达式 是否是成员表达式 (a.b()  console.log) 类型调用
     * 2. 判断调用对象是否是console ,详细 还可以判断调用的属性 方法 是否是 log info error
     */
    if (
      types.isMemberExpression(path.node.callee) &&
      path.node.callee.object.name === 'console'
    ) {
      path.remove();
    }
  },
});

const { code } = generator(AST);
// 写入bundle 文件
console.log(code);
// 还可以改成babel 插件 ，这里先不改了
fs.writeFile(path.resolve(__dirname, 'target_bundle.js'), code, () => {});
```

最后得到的目标代码

```js
const name = '123';
function func(a, b) {
  const v = a + b;
  return v;
}
const value = func(1, 2);
```
