const { build, serve } = require('esbuild');
const path = require('path');

const esbuildConfig = {
  // ----  如下是一些常见的配置  ---
  // 当前项目根目录
  absWorkingDir: path.resolve(__dirname),
  // 入口文件列表，为一个数组
  entryPoints: [path.resolve(__dirname, './src/index.tsx')],
  // 打包产物目录
  outdir: 'esbuild-dist',
  // 是否需要打包，一般设为 true
  bundle: true,
  // 模块格式，包括`esm`、`commonjs`和`iife`
  format: 'esm',
  // 需要排除打包的依赖列表
  external: [],
  // 是否开启自动拆包
  splitting: true,
  // 是否生成 SourceMap 文件
  sourcemap: true,
  // 是否生成打包的元信息文件
  metafile: true,
  // 是否进行代码压缩
  minify: false,
  // 是否开启 watch 模式，在 watch 模式下代码变动则会触发重新打包
  // watch: false,
  // 是否将产物写入磁盘
  write: true,
  // Esbuild 内置了一系列的 loader，包括 base64、binary、css、dataurl、file、js(x)、ts(x)、text、json
  // 针对一些特殊的文件，调用不同的 loader 进行加载
  loader: {
    '.png': 'base64',
  },
};
// console.log(process.cwd());
async function runBuild() {
  serve(
    {
      port: 8000,
      // 静态资源目录
      servedir: './dist',
    },
    esbuildConfig
  ).then((server) => {
    console.log('HTTP Server starts at port', server.port);
  });
}

runBuild();
