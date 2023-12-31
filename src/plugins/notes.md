# html 处理作业

1. 对比 rollup/webpack 开发 html plugin，总结二者异同
   rollup/webpack 的本质都是使用 各自提供的钩子，在特定的时机去拿到入口文件的路径写入到 html 模板中
   差异是 webpack 本质一个类，提供的 hook 比较多，我们使用的时候需要各种组合，拿到我们一些信息， rollup 插件更像是一个方法，返回一个配置信息，使用起来比较简单，也更容易拿到我们需要的配置信息。

2. 模拟实现 html-webpack-plugin

```js
/*
 * @Author: yuzhicheng
 * @Date: 2023-03-27 14:36:34
 * @Last Modified by: yuzhicheng
 * @Last Modified time: 2023-03-27 16:20:42
 */

const { Compilation, Compiler } = require('webpack');

// Compiler：全局构建管理器，Webpack 启动后会首先创建 compiler 对象，
// 负责管理配置信息、Loader、Plugin 等。从启动构建到结束

// Compilation：单次构建过程的管理器，负责遍历模块，执行编译操作；当 watch = true 时，每次文件变更触发重新编译，
// 都会创建一个新的 compilation 对象

// 获取资源路径的公共路径
// 接受 compilation 作为操作，compilation 是单次构建过程中的管理器
/**
 *
 * @param {Compilation} compilation
 */
function getPublicPath(compilation) {
  const compilationHash = compilation.hash;
  let publicPath = compilation.getAssetPath(
    compilation.outputOptions.publicPath,
    { hash: compilationHash }
  );
  // 如果 output.publicPath 没有设置，则它的选项为 auto
  if (publicPath === 'auto') {
    publicPath = '/';
  }

  // 公共路径自动补 /
  if (publicPath.length && publicPath.substr(-1, 1) !== '/') {
    publicPath += '/';
  }

  return publicPath;
}

const PLUGIN_NAME = 'htmlWebpackPlugin';

function html({ title, scripts }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  ${scripts.map((src) => `<script defer src="${src}"></script>`).join('\n  ')}
</head>
<body>
  Hello, World
</body>
</html>
`;
}

// plugin 本质就是一个 带有apply 方法的类
// webpack 在启动时候会调用插件对象的apply 方法，并以参数方法传递核心对象 compiler 对象
// 插件内可以注册 compiler 对象及其子对象的钩子(Hook)回调
class HtmlWebpackPlugin {
  constructor(options) {
    this.options = options || {};
  }

  /**
   *
   * @param {Compiler} compiler
   */
  apply(compiler) {
    const webpack = compiler.webpack;

    // 初始化 compilation 时调用，在触发 compilation 事件之前调用。
    // 周期，包含了当前编译周期的所有信息。Webpack 在创建 Compilation 对象时，会触发 compiler.hooks.thisCompilation 钩子，
    // 将当前的 Compilation 对象作为参数传递给所有注册的插件
    compiler.hooks.thisCompilation.tap(
      PLUGIN_NAME,
      /**
       *
       * @param {Compilation} compilation
       */
      (compilation) => {
        // 在本次构建的compilation 实例中的 hooks 注册 processAssets 钩子 使用 call异步风格方式
        // 该钩子会在编译周期中的资源生成阶段被调用，
        // stage 属性指定了处理资源的时机为 webpack.Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE_INLINE
        compilation.hooks.processAssets.tapAsync(
          {
            name: PLUGIN_NAME,
            stage:
              compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE_INLINE,
          },
          (_compilationAssets, cb) => {
            const publicPath = getPublicPath(compilation);
            const entryNames = Array.from(compilation.entrypoints.keys());
            const assets = entryNames
              .map((entryName) =>
                compilation.entrypoints.get(entryName).getFiles()
              )
              .flat();
            const scripts = assets.map((src) => publicPath + src);
            const content = html({
              title: this.options.title || 'Demo',
              scripts,
            });
            // compilation.emitAsset 是 Webpack 的 Compilation 对象提供的一个方法，
            // 用于在资源生成阶段向输出目录中添加一个新的资源。
            compilation.emitAsset(
              'index.html',
              new webpack.sources.RawSource(content)
            );
            cb();
          }
        );
      }
    );
  }
}

module.exports = HtmlWebpackPlugin;
```

3. 如何注入变量到 html 中
   使用 html-webpack-plugin 的时候配置 templateParameters 参数

4. 如何将 webpack.runtime.js 注入到 html 中
   在 webpack-htlm-plugin 的实践中,是通过 `compilation.entrypoints.get(entryName).getFiles()`根据 entryName 拿到入口点生成的所有文件路径，如果我们配置 `optimization.runtimeChunk` 也会通过 getFiles 拿到相关路径信息，写入到 html 中，
   同时我们也可以 entrypoint.getRuntimeChunk() 拿到单独的 runtimeChunk 的信息
