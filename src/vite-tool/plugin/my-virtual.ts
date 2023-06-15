import { Plugin, ResolvedConfig, normalizePath } from 'vite';
import fs from 'node:fs';
import pug from 'pug';
import path from 'node:path';
import type { Options } from 'pug';

interface IOps {
  template: string;
  entry: string;
}

function changeFileExtension(filePath: string, newExtension: string) {
  return filePath.replace(/\.[^.]+$/, '.' + newExtension);
}

export default function virtualHtml(opts: IOps): Plugin {
  let config: ResolvedConfig;
  const { template, entry } = opts;

  return {
    name: 'my-virtual-html',
    enforce: 'pre',
    config(config, { command }) {
      const tplPath = normalizePath(path.resolve(config.root, template));
      const { name } = path.parse(tplPath);
      return {
        build: {
          rollupOptions: {
            input: {
              [name]: tplPath,
            },
          },
        },
      };
    },

    configResolved(resolvedConfig) {
      config = resolvedConfig;
    },

    resolveId(source) {
      const tplPath = normalizePath(path.resolve(config.root, template));
      if (source === tplPath) {
        return changeFileExtension(source, 'html');
      }
    },

    load(id) {
      const tplPath = normalizePath(path.resolve(config.root, template));
      if (changeFileExtension(tplPath, 'html') === id) {
        return compilePug(tplPath);
      }
    },

    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const tplPath = path.resolve(config.root, template);
        const { name } = path.parse(tplPath);
        const reg = new RegExp(`^/${name}(\\.html)?$`);

        if (reg.test(req.url) || (req.url === '/' && name === 'index')) {
          const tpl = compilePug(tplPath);
          const r = await server.transformIndexHtml('/index.html', tpl);
          res.setHeader('Content-Type', 'text/html');
          res.statusCode = 200;
          res.end(r);
          return;
        }
        next();
      });
    },

    transformIndexHtml: {
      enforce: 'pre',
      async transform(html) {
        let targetEntry = entry;
        return {
          html,
          tags: [
            {
              injectTo: 'body',
              attrs: { type: 'module', src: normalizePath(targetEntry) },
              tag: 'script',
            },
          ],
        };
      },
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
