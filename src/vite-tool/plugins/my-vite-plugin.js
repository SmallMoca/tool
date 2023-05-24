/*
 * @Author: yuzhicheng
 * @Date: 2023-05-18 18:33:41
 * @Last Modified by: yuzhicheng
 * @Last Modified time: 2023-05-24 13:11:21
 * @Desc Vite plugin
 */
import path from 'path';
import chalk from 'chalk';
import { createDebug } from './utils/create-debug';

const debug = createDebug('my');
// console.log(debug);

/**
 *
 * @param {{entry:string}} opts
 * @return {import('vite').Plugin}
 */
function myVitePlugin(opts = {}) {
  const { entry } = opts;
  /** @type {import('vite').UserConfig} */
  let config;

  return {
    name: 'vite-plugin-my',
    config(config, { command }) {
      // 新增一个 resolve.Alisa 配置
      return {
        resolve: {
          alias: {
            comps: path.resolve(config.root, './src/components'),
          },
        },
      };
    },

    // vite 解析完 配置之后会调用 configResolved 钩子
    // 我们一般用这个钩子来记录最终的配置信息
    configResolved(resolvedConfig) {
      // console.log(resolvedConfig.resolve.alias);
      config = resolvedConfig;
    },

    // configureServer(server) {
    //   server.middlewares.use((req, res, next) => {
    //     console.log(res, res, next);
    //   });
    // },

    transform(code, id) {
      const regex = /src\/vite-tool\/src\/.*\.(tsx|js|ts)$/;
      if (regex.test(id)) {
        debug('add info line info %s', chalk.green(id));
        // return id;
        const addLine = `\nconst filePath = "${id}call";\nconsole.log(filePath);\n`;
        return addLine + code;
      }
    },
  };
}

module.exports = myVitePlugin;
