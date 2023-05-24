/*
 * @Author: yuzhicheng
 * @Date: 2023-05-24 10:49:37
 * @Last Modified by: yuzhicheng
 * @Last Modified time: 2023-05-24 15:46:33
 * @Desc vite-better-html-plugin
 */

import type { Plugin, ResolvedConfig } from 'vite';
import { createDebug } from '../plugins/utils/create-debug.js';
import chalk from 'chalk';
import connect from 'connect';
const debug = createDebug('html');

interface IIptions {
  title?: string;
  template?: string;
}

function myCustomMiddleware() {
  const app = connect();
  app.use((req, res, next) => {
    const html = `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>tvite better html plugin</title>
    </head>
    <body>
  <div id="root"></div>
  <script type="module" src="./src/index.tsx"></script>
    </body>
    </html>`.trim();
    res.setHeader('Content-Type', 'text/html');
    res.write(html);
    next();
  });

  return app;
}

export default function viteHtmlPlugin(options: IIptions = {}): Plugin {
  // console.log(options);
  let config: ResolvedConfig;
  return {
    name: 'vite-better-html-plugin',
    configResolved(resolvedConfig) {
      config = resolvedConfig;
    },
    configureServer(server) {
      server.middlewares.use('/test', (req, res, next) => {
        const html = `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>tvite better html plugin</title>
      </head>
      <body>
        <div id="root"></div>
        <div>test page</div>
        <script type="module" src="./src/index.tsx"></script>

      </body>
      </html>`.trim();
        res.setHeader('Content-Type', 'text/html');
        debug('dddd');
        res.write(html);
      });
    },
    transformIndexHtml(html) {
      console.log(html);
      return html;
    },
  };
}
