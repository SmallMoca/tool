const connect = require('connect');
const handlebars = require('handlebars');
const path = require('path');
import createDebug from './utils/create-debug';
const chalk = require('chalk');

const debug = createDebug('customHtml');
const reactRefreshTpl =
  ` <script type="module">import { injectIntoGlobalHook } from "/@react-refresh";
injectIntoGlobalHook(window);
window.$RefreshReg$ = () => {};
window.$RefreshSig$ = () => (type) => type;</script>
<script type="module" src="/@vite/client"></script>`.trim();

debug('reactRefreshTpl = %s', chalk.red(reactRefreshTpl));

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
    res.statusCode(200);

    next();
  });

  return app;
}

function myCustomPlugin(opts = {}) {
  const { entry } = opts;
  return {
    name: 'my-custom-plugin',
    configureServer: function ({ middlewares }) {
      middlewares.use('/test', myCustomMiddleware());
    },
    // transformIndexHtml(html) {
    //   console.log('transformIndexHtml', html);
    //   return {
    //     html,
    //     tags: [
    //       {
    //         injectTo: 'body',
    //         attrs: { type: 'module', src: entry },
    //         tag: 'script',
    //       },
    //     ],
    //   };
    // },
  };
}

module.exports = myCustomPlugin;
