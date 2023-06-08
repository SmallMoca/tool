# vite 中如何处理 html

## 开发环境 vite

```bash
vite [root]
```

源码

> packages/vite/src/node/cli.ts?Line=107

```TS
// dev
cli
  .command('[root]', 'start dev server') // default command
  .alias('serve') // the command is called 'serve' in Vite's API
  .alias('dev') // alias to align with the script name
  .option('--host [host]', `[string] specify hostname`)
  .option('--port <port>', `[number] specify port`)
  .option('--https', `[boolean] use TLS + HTTP/2`)
  .option('--open [path]', `[boolean | string] open browser on startup`)
  .option('--cors', `[boolean] enable CORS`)
  .option('--strictPort', `[boolean] exit if specified port is already in use`)
  .option(
    '--force',
    `[boolean] force the optimizer to ignore the cache and re-bundle`,
  )
  .action(async (root: string, options: ServerOptions & GlobalCLIOptions) => {
    filterDuplicateOptions(options)
    // output structure is preserved even after bundling so require()
    // is ok here
    const { createServer } = await import('./server')
    try {
      // 启动node 服务器
      const server = await createServer({
        root,
        base: options.base,
        mode: options.mode,
        configFile: options.config,
        logLevel: options.logLevel,
        clearScreen: options.clearScreen,
        optimizeDeps: { force: options.force },
        server: cleanOptions(options),
      })

      if (!server.httpServer) {
        throw new Error('HTTP server not available')
      }

      await server.listen()
      // ...
    } catch (e) {
      const logger = createLogger(options.logLevel)
      logger.error(colors.red(`error when starting dev server:\n${e.stack}`), {
        error: e,
      })
      stopProfiler(logger.info)
      process.exit(1)
    }
  })

```

在 cli 源码中可以看见 vite 开发环境本质上是启动了一个 node 服务器
在 cli 执行的 `createServer` 方法中开发发现 vite 使用了一个 indexHtmlMiddleware 中间件 处理我们的.html 资源访问请求

> packages/vite/src/node/server/index.ts?Line=649

```ts
// 匹配 */ 结尾的路径 为 */index.html
if (config.appType === 'spa' || config.appType === 'mpa') {
  middlewares.use(htmlFallbackMiddleware(root, config.appType === 'spa'));
}

// 执行config 配置的后置钩子
// 在html 中间件前执行 用户添加的 configureServer 钩子 方便用户提供自定义内容 而非 index.html
postHooks.forEach((fn) => fn && fn());

// 单页面应用 或 多页面应用
if (config.appType === 'spa' || config.appType === 'mpa') {
  // 应用indexHtmlMiddleware 中间件
  // 这中间件 去处理.html 相关扩展名的请求
  middlewares.use(indexHtmlMiddleware(server));

  // handle 404s
  // Keep the named function. The name is visible in debug logs via `DEBUG=connect:dispatcher ...`
  middlewares.use(function vite404Middleware(_, res) {
    res.statusCode = 404;
    res.end();
  });
}
```

> packages/vite/src/node/server/middlewares/indexHtml.ts?Line=316

```TS
export function indexHtmlMiddleware(
  server: ViteDevServer,
): Connect.NextHandleFunction {
  // Keep the named function. The name is visible in debug logs via `DEBUG=connect:dispatcher ...`
  return async function viteIndexHtmlMiddleware(req, res, next) {
    if (res.writableEnded) {
      return next()
    }

    const url = req.url && cleanUrl(req.url)
    // htmlFallbackMiddleware appends '.html' to URLs
    if (url?.endsWith('.html') && req.headers['sec-fetch-dest'] !== 'script') {
      const filename = getHtmlFilename(url, server)
      if (fs.existsSync(filename)) {
        try {
          let html = await fsp.readFile(filename, 'utf-8')
          html = await server.transformIndexHtml(url, html, req.originalUrl)
          return send(req, res, html, 'html', {
            headers: server.config.server.headers,
          })
        } catch (e) {
          return next(e)
        }
      }
    }
    next()
  }
}
```

## 构建
