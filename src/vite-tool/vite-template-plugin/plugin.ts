import { Plugin, ResolvedConfig, normalizePath } from 'vite';
import fs from 'node:fs';
import pug from 'pug';
import path from 'node:path';
import chalk from 'chalk';
import type { Options } from 'pug';

interface IEntry {
  template: string;
  entry?: string;
}

export function templatePlugin(entrys: IEntry[]): Plugin {
  let config: ResolvedConfig;

  return {
    name: 'vite-plugin-template',
    enforce: 'pre',
    configResolved(resolvedConfig) {
      config = resolvedConfig;
    },
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const { url } = req;
        const resolveTemplates = entrys.map((e) =>
          normalizePath(
            path.relative(config.root, path.resolve(config.root, e.template))
          )
        );
        console.log(chalk.bgGreen(resolveTemplates.toString()));

        next();
      });
    },
  };
}

const compilePug = (path: string, pugOptions: Options = {}) => {
  const source = fs.readFileSync(path, 'utf-8');

  // pug.compile 转化为html
  const tplFunc = pug.compile(source, {
    filename: path, //模板文件的路径或名称，用于在编译错误时输出提示信息。
    doctype: pugOptions.doctype || 'html', // HTML 文档类型，可以是 html、xml 或 transitional 等。
    pretty: pugOptions.pretty, //是否使用漂亮的输出格式，即是否在生成的 HTML 代码中保留缩进和换行符。
    self: pugOptions.self, // 是否使用 self 变量来引用模板函数，以避免命名冲突。
    compileDebug: false, //  是否启用调试模式，即是否在编译后的代码中保留调试信息。
    globals: ['require'].concat(pugOptions.globals || []), // 在编译时要添加到全局作用域的变量列表。
    inlineRuntimeFunctions: false, // 是否将运行时函数内联到编译后的代码中。默认为 false，即不内联。
    filters: pugOptions.filters, // 要使用的 Pug 过滤器列表。默认为空数组
  });
  return tplFunc({ upgradeInsecureRequests: false });
};
