/**
 * @reference https://github.com/vercel/next.js/blob/v12.3.1/packages/next/build/webpack-config.ts#L934
 */
const path = require('path');

const topLevelFrameworkPaths = [];
const visitedFrameworkPaths = new Set();

// eslint-disable-next-line consistent-return
const addTopLevelFrameworkPaths = (packageName) => {
  try {
    if (visitedFrameworkPaths.has(packageName)) return false;
    visitedFrameworkPaths.add(packageName);
    if (topLevelFrameworkPaths.includes(packageName)) {
      return false;
    }
    topLevelFrameworkPaths.push(packageName);
    const packageJsonPath = require.resolve(`${packageName}/package.json`, [
      path.resolve(__dirname, '../node_modules'),
    ]);
    const { dependencies } = require(packageJsonPath);
    for (const name of Object.keys(dependencies)) {
      addTopLevelFrameworkPaths(name);
    }
  } catch (_) {
    // todo
  }

  // console.log(dependencies);
};

for (const packageName of ['react', 'react-dom']) {
  addTopLevelFrameworkPaths(packageName);
}
