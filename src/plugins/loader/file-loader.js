// file-loader
// 简单实现
// 支持配置outputPath publicPath

// 通过 this.getOptions 接口获取 Loader 配置对象；
// 使用 schema-utils 的 validate 接口校验 Loader 配置是否符合预期，配置 Schema 定义在 src/options.json 文件；
// 返回经过修改的内容。

// 使用 loader-utils 辅助我们开发loader
// 在 Webpack5 之前，loader-utils 是一个非常重要的 Loader 开发辅助工具，为开发者提供了诸如 getOptions/getCurrentRequest/parseQuery 等核心接口，这些接口被诸多 Loader 广泛使用，到 Webpack5 之后干脆将这部分能力迁移到 Loader Context，致使 loader-utils 被大幅裁减简化
// 参看 https://webpack.docschina.org/api/loaders/#the-loader-context
const optionsSchema = {
  type: 'object',
  properties: {
    outputPath: {
      type: 'string',
    },
    publicPath: {
      type: 'string',
    },
  },
};
const { validate } = require('schema-utils');
const { interpolateName } = require('loader-utils');
const path = require('path');
function loader(content) {
  const options = this.getOptions();

  validate(optionsSchema, options, {
    name: 'File Loader', // loader的名称，用于错误提示
    baseDataPath: 'options', //  options 对象的基础路径，用于错误提示
  });

  const context = options.context || this.rootContext;
  const name = options.name || '[contenthash].[ext]';

  // 根据 Loader 配置，调用 interpolateName 方法拼接目标文件的完整路径
  // interpolateName 类似 https://webpack.js.org/configuration/output/#template-strings
  const url = interpolateName(this, name, {
    context,
    content,
    regExp: options.regExp,
  });

  let outputPath = url;

  if (options.outputPath) {
    outputPath = path.posix.join(options.outputPath, url);
  }

  let publicPath = `__webpack_public_path__ + ${JSON.stringify(outputPath)}`;

  if (options.publicPath) {
    if (typeof options.publicPath === 'function') {
      publicPath = options.publicPath(url, this.resourcePath, context);
    } else {
      publicPath = `${
        options.publicPath.endsWith('/')
          ? options.publicPath
          : `${options.publicPath}/`
      }${url}`;
    }
  }
  const assetInfo = {};
  assetInfo.immutable = true;
  this.emitFile(outputPath, content, null);

  const esModule =
    typeof options.esModule !== 'undefined' ? options.esModule : true;

  return `${esModule ? 'export default' : 'module.exports ='} ${publicPath};`;
}

module.exports = loader;
// 默认情况下，资源文件会被转化为 UTF-8 字符串，然后传给 loader。通过设置 raw 为 true，
// loader 可以接收原始的 Buffer。每一个 loader 都可以用 String 或者 Buffer 的形式传递它的处理结果。complier 将会把它们在 loader 之间相互转换。
module.exports.raw = true;
