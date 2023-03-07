# better hash

## moduleId 的不确定性

index 没有引入 lodash 之前

sum：
moduleId = 1
fileName = 1.c10a3c1277c2141d36d6.chunk.js
mainFilename = main.e714341e11a218b30526.js

引入之后
sum：
moduleId = 2
fileName = 1.e177d2e0db1d97f210ae.chunk.js
mainFilename = main.c099929e90b0d2598cec.js

## chunkId 的不确定性

## deterministic

> 生成环境 默认 deterministic

```js
...
 optimization: {
    moduleIds: 'deterministic',
    chunkIds: 'deterministic',
  },
...
```

sum chunkId 218 moduleId 218
lodash chunkId 486 moduleId 486
