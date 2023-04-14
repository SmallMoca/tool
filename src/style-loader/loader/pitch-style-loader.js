// style-loader

function stringifyRequest(loaderContext, request) {
  if (
    typeof loaderContext.utils !== 'undefined' &&
    typeof loaderContext.utils.contextify === 'function'
  ) {
    return JSON.stringify(
      loaderContext.utils.contextify(loaderContext.context, request)
    );
  }
  const splitted = request.split('!');
  const { context } = loaderContext;
  return JSON.stringify(
    splitted
      .map((part) => {
        // First, separate singlePath from query, because the query might contain paths again
        const splittedPart = part.match(/^(.*?)(\?.*)/);
        const query = splittedPart ? splittedPart[2] : '';
        let singlePath = splittedPart ? splittedPart[1] : part;
        if (isAbsolutePath(singlePath) && context) {
          singlePath = _path.default.relative(context, singlePath);
          if (isAbsolutePath(singlePath)) {
            // If singlePath still matches an absolute path, singlePath was on a different drive than context.
            // In this case, we leave the path platform-specific without replacing any separators.
            // @see https://github.com/webpack/loader-utils/pull/14
            return singlePath + query;
          }
          if (isRelativePath(singlePath) === false) {
            // Ensure that the relative path starts at least with ./ otherwise it would be a request into the modules directory (like node_modules).
            singlePath = `./${singlePath}`;
          }
        }
        return singlePath.replace(/\\/g, '/') + query;
      })
      .join('!')
  );
}

module.exports = function (content) {
  // do nothing
};

module.exports.pitch = function (remainingRequest) {
  /*
   * 用require语句获取css-loader返回的js模块的导出
   * 用'!!'前缀跳过配置中的loader，避免重复执行
   * 用remainingRequest参数获取loader链的剩余部分，在本例中是css-loader、less-loader
   * 用loaderUtils的stringifyRequest方法将request语句中的绝对路径转为相对路径
   */
  const requestPath = stringifyRequest(this, '!!' + remainingRequest);

  // 本例中requestPath为:
  // '!!../node_modules/css-loader/index.js!../node_modules/less-loader/dist/cjs.js!src/styles/index.less'
  // console.log(requestPath, '-----------requestPathlog---------------');
  return `
  import content, * as namedExport from ${requestPath};
    const style = document.createElement('style');
    style.innerHTML = content;
    document.head.appendChild(style);
  `;
};
