import fs from 'node:fs';
import pug from 'pug';
import path from 'node:path';
import { normalizePath } from 'vite';
import type { Plugin, ResolvedConfig } from 'vite';
import type { Options } from 'pug';

interface IEntry {
  template: string;
  entry?: string;
}

function matchEntry(entrys: IEntry[], url: string, root: string) {
  return entrys.find((e) => {
    const { dir, name } = path.parse(path.resolve(root, e.template));
    return (
      normalizePath(path.resolve(root, `${dir}/${name}.html`)) ===
      normalizePath(path.resolve(root, url))
    );
  });
}

function changeFileExtension(filePath: string, newExtension: string) {
  return filePath.replace(/\.[^.]+$/, '.' + newExtension);
}

export function templatePlugin(entrys: IEntry[]): Plugin {
  let config: ResolvedConfig;

  const cahce = new Set<string>();
  return {
    name: 'vite-plugin-template',
    enforce: 'pre',

    config(config, { command }) {
      const input: Record<string, string> = {};
      entrys.forEach((e) => {
        const resolvePath = normalizePath(
          path.resolve(config.root, e.template)
        );
        let { name, dir } = path.parse(
          normalizePath(path.relative(config.root, resolvePath))
        );
        let entryName = name;
        if (dir.length !== 0) {
          entryName = `${dir}/${name}`;
        }
        input[entryName] = resolvePath;
      });

      return {
        build: {
          rollupOptions: {
            input,
          },
        },
      };
    },
    configResolved(resolvedConfig) {
      config = resolvedConfig;
    },
    resolveId(source) {
      if (source.endsWith('.pug')) {
        const path = changeFileExtension(source, 'html');
        cahce.add(path);
        return path;
      }
    },

    load(id) {
      if (cahce.has(id)) return compilePug(changeFileExtension(id, 'pug'));
    },

    configureServer(server) {
      // todo 在vite 内置中间件 之后执行 ，使用vite的htmlFallbackMiddleware 处理过的url
      return () => {
        server.middlewares.use(async (req, res, next) => {
          const { url } = req;

          if (
            url?.endsWith('.html') &&
            req.headers['sec-fetch-dest'] !== 'script'
          ) {
            const templatePath = matchEntry(
              entrys,
              `./${url}`,
              config.root
            )?.template;

            if (templatePath) {
              const { ext } = path.parse(templatePath);
              const realPath = path.resolve(config.root, templatePath);
              let str = '';
              if (ext === '.pug') {
                str = compilePug(realPath);
              } else {
                str = fs.readFileSync(realPath, 'utf-8');
              }
              const html = await server.transformIndexHtml(url, str);
              res.setHeader('Content-Type', 'text/html');
              res.end(html);
              return;
            }
          }

          next();
        });
      };
    },

    transformIndexHtml: {
      enforce: 'pre',
      async transform(html, { filename, originalUrl }) {
        const target = matchEntry(entrys, filename, config.root);
        if (target && target.entry) {
          return {
            html,
            tags: [
              {
                injectTo: 'body',
                attrs: {
                  type: 'module',
                  src: normalizePath(target.entry),
                },
                tag: 'script',
              },
            ],
          };
        }
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
