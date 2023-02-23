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
