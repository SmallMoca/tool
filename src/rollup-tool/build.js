const path = require('path');
const rollup = require('rollup');
const resolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const del = require('rollup-plugin-delete');
/**
 * @type {import('rollup').InputOptions}
 */
const inputOptions = {
  input: path.resolve(__dirname, './src/index.js'),
  external: [],
  plugins: [resolve(), commonjs(), del()],
};

const DIST_DIR = 'dist-2';

/**
 * @type {import('rollup').OutputOptions[]}
 */
const outputOptionsList = [
  {
    dir: path.resolve(__dirname, DIST_DIR),
    entryFileNames: '[name].[hash].js',
    chunkFileNames: 'chunk.[hash].js',
    assetFileNames: 'assets/[name]-[hash][extname]',
    format: 'es',
    sourcemap: true,
  },
];

async function build() {
  let bundle;
  let buildFailded = false;
  try {
    // 启动一次打包
    bundle = await rollup(inputOptions);
    await generateOutputs(bundle);
    console.log(bundle.watchFiles);
  } catch (error) {
    buildFailded = true;
    console.error(error);
  }

  if (bundle) {
    await bundle.close();
  }

  process.exit(buildFailded ? 1 : 0);
}

/**
 *
 * @param {import('rollup').RollupBuild} bundle
 */
async function generateOutputs(bundle) {
  for (const outputOptions of outputOptionsList) {
    await bundle.generate(outputOptions);
    await bundle.write(outputOptions);
  }
}

// build();

const watcher = rollup.watch({
  // 和 rollup 配置文件中的属性基本一致，只不过多了`watch`配置
  input: path.resolve(__dirname, './src/index.js'),
  output: [
    {
      dir: path.resolve(__dirname, 'dist/es'),
      format: 'esm',
    },
    {
      dir: path.resolve(__dirname, 'dist/cjs'),
      format: 'cjs',
    },
  ],
  watch: {
    exclude: ['node_modules/**'],
    include: ['src/**'],
  },
});

// 监听 watch 各种事件
watcher.on('restart', () => {
  console.log('重新构建...');
});

watcher.on('change', (id) => {
  console.log('发生变动的模块id: ', id);
});

watcher.on('event', (e) => {
  if (e.code === 'BUNDLE_END') {
    console.log('打包信息:', e);
  }
});
