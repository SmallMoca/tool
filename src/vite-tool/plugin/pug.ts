import type { Plugin, ResolvedConfig } from 'vite';
import chalk from 'chalk';
import createDebug from '../plugins/utils/create-debug.js';
import pug from 'pug';
import path from 'path';
import fs from 'fs';
const debug = createDebug('debug');

interface IOps {
  template: string;
}

export default function pugPlugin(opts: IOps): Plugin {
  const { template } = opts;
  let config: ResolvedConfig;

  return {
    name: 'rp:pug',
    configResolved(resolvedConfig) {
      config = resolvedConfig;
    },
    buildStart() {
      // debug(config.root);
      const templatePath = path.resolve(config.root, template);
      const htmlStr = fs.readFileSync(templatePath, 'utf-8');
      console.log(chalk.bgGreen(htmlStr));
      const fn = pug.compileClient(htmlStr, {
        filename: 'index',
        pretty: true,
        doctype: 'html',
        compileDebug: true,
      });
      // fn({ upgradeInsecureRequests: false });
      // console.log(html);
    },
  };
}
