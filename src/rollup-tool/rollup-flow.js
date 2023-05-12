// rollup 打包 三个阶段
// input  -> build -> output

// rollup 在build 阶段会解析各个模块的内容以及依赖关系 然后进入output 阶段 完成打包输出
// rollup 在这两个阶段 提供的各种hook 供我们开发插件 拓展 rollup的能力

// rollup hook 根据不同的执行方式又大概可以分为 async sync parallel sequential fist 五种

// async sync 同步和异步执行
// parallel 并行执行
// sequential  串行执行 主要是作用于插件之间相互依赖的情况，前一个插件的hook 的返回值 作为后续插件的入参
// first 如果有多个插件实现了这个 Hook，那么 Hook 将依次运行，直到返回一个非 null 或非 undefined 的值为止

const path = require('path');
const rollup = require('rollup');
const resolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const alias = require('./plugins/alias');
const image = require('./plugins/image');
const html = require('@rollup/plugin-html');
const { output } = require('./rollup.config');

(async () => {
  let buildFailed = false;

  try {
    // build 阶段 分析 各个模块内容 以及生成依赖关系
    const bundle = await rollup.rollup({
      input: path.resolve(__dirname, './src/index.js'),
      plugins: [
        resolve(),
        commonjs(),
        alias({
          entries: [
            // 转换为 import xxx from './module-a'
            {
              find: 'utils',
              replacement: path.resolve(__dirname, './src/utils'),
            },
            {
              find: 'assets',
              replacement: path.resolve(__dirname, './src/assets'),
            },
          ],
        }),
        image(),
        html(),
      ],
    });

    const outputOptions = {
      dir: path.resolve(__dirname, 'plugin-dist-product'),
      format: 'umd',
    };

    // bundle.generate 方法 ：根据输出输出对象 生成不同的产物到内存中
    await bundle.generate(outputOptions);
    await bundle.write(outputOptions);
  } catch (error) {
    buildFailed = false;
    console.error(error);
  }
})();

if (false) {
  const watcher = rollup.watch({
    input: path.resolve(__dirname, './src/index.js'),
    plugins: [
      resolve(),
      commonjs(),
      alias({
        entries: [
          // 转换为 import xxx from './module-a'
          {
            find: 'utils',
            replacement: path.resolve(__dirname, './src/utils'),
          },
          {
            find: 'assets',
            replacement: path.resolve(__dirname, './src/assets'),
          },
        ],
      }),
      image(),
      html(),
    ],
    output: {
      dir: path.resolve(__dirname, 'plugin-dist-product'),
      format: 'umd',
    },
  });

  // 这将确保在每次运行后正确关闭打包
  watcher.on('event', ({ result }) => {
    console.log('run event');
    if (result) {
      result.close();
    }
  });

  // 此外，你可以挂钩以下内容。
  // 同样，返回 Promise 以使 Rollup 在该阶段等待：
  watcher.on('change', (id, { event }) => {
    console.log(id, 'change');
    /* 更改了一个文件 */
  });
  watcher.on('restart', () => {
    /* 新触发了一次运行 */
  });
  watcher.on('close', () => {
    /* 监视器被关闭了，请看下面的代码 */
  });
}
