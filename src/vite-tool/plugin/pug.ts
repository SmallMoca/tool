import { Plugin, ResolvedConfig, ConfigEnv, normalizePath } from 'vite';
import chalk from 'chalk';
import pug from 'pug';
import type { Options } from 'pug';
import path from 'path';
import fs from 'fs';
import history from 'connect-history-api-fallback';
import type { Options as HistoryOptions } from 'connect-history-api-fallback';

function dest(outFolder, str, filename) {
  // 构造目标文件路径
  const filePath = path.join(outFolder, filename);

  // 创建目录（如果不存在）
  fs.mkdirSync(path.dirname(filePath), { recursive: true });

  // 将字符串写入目标路径
  fs.writeFileSync(filePath, str);

  // 返回写入的文件路径
  return filePath;
}

interface IOps {
  template: string;
  entry: string;
}

const DEV_HTML_DIR_PREFIX = '.rp-pug-temp-html';

export default function pugPlugin(
  opts: IOps,
  pugOptions: Options = {}
): Plugin {
  const { template, entry } = opts;
  let config: ResolvedConfig;
  let htmlDir;
  let cacheCommand: ConfigEnv['command'];
  let serverTempHtmlPath: string;
  return {
    name: 'rp:pug',
    config(config, { command }) {
      cacheCommand = command;
      return {
        build: {
          rollupOptions: {
            input: {
              index: path.resolve(
                config.root,
                './.rp-pug-temp-html/index.html'
              ),
            },
          },
        },
      };
    },

    configResolved(resolvedConfig) {
      config = resolvedConfig;
      htmlDir = path.resolve(config.root, DEV_HTML_DIR_PREFIX);
    },
    buildStart() {
      // debug(config.root);
      const templatePath = path.resolve(config.root, template);
      const source = fs.readFileSync(templatePath, 'utf-8');

      // pug.compile 转化为html
      const tplFunc = pug.compile(source, {
        filename: templatePath, //模板文件的路径或名称，用于在编译错误时输出提示信息。
        doctype: pugOptions.doctype || 'html', // HTML 文档类型，可以是 html、xml 或 transitional 等。
        pretty: pugOptions.pretty, //是否使用漂亮的输出格式，即是否在生成的 HTML 代码中保留缩进和换行符。
        self: pugOptions.self, // 是否使用 self 变量来引用模板函数，以避免命名冲突。
        compileDebug: false, //  是否启用调试模式，即是否在编译后的代码中保留调试信息。
        globals: ['require'].concat(pugOptions.globals || []), // 在编译时要添加到全局作用域的变量列表。
        inlineRuntimeFunctions: false, // 是否将运行时函数内联到编译后的代码中。默认为 false，即不内联。
        filters: pugOptions.filters, // 要使用的 Pug 过滤器列表。默认为空数组
      });
      const html = tplFunc({ upgradeInsecureRequests: false });
      serverTempHtmlPath = dest(htmlDir, html, 'index.html');
    },

    configureServer(server) {
      const rewrites: HistoryOptions['rewrites'] = [
        {
          from: new RegExp(`^/*`),
          to({ parsedUrl }: any) {
            return '/.rp-pug-temp-html/index.html';
          },
        },
      ];

      server.middlewares.use(
        history({
          disableDotRule: undefined,
          htmlAcceptHeaders: ['text/html', 'application/xhtml+xml'],
          rewrites: rewrites,
        })
      );
    },
    transformIndexHtml: {
      enforce: 'pre',
      async transform(html) {
        let targetEntry = entry;

        if (cacheCommand === 'build') {
          targetEntry = path.relative(
            htmlDir,
            path.resolve(config.root, entry)
          );
        }

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
    async closeBundle() {
      console.log('closeBundle');
    },
    generateBundle(outPutOptions, buildle) {
      for (const key in buildle) {
        console.log(chalk.bgRed(key));
      }
    },
  };
}
