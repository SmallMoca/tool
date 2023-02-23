const fs = require('fs');
const path = require('path');

let reg1 = /(?<=require\(\')(.+?)(?=\'\))/g;

const matchFileRequireFiles = (str, curPath) => {
  const matchs = str.match(reg1);
  if (matchs) {
    return matchs.map((item) => path.resolve(curPath, `${item}.js`));
  }
  return [];
};

const readFileToString = (filePath) => {
  try {
    const buffer = fs.readFileSync(filePath);
    return buffer.toString();
  } catch (error) {
    return undefined;
  }
};
const modules = [];
function entry(filePath) {
  modules.push(filePath);
  const str = readFileToString(filePath);
  const selfRequireFiles = matchFileRequireFiles(
    str,
    path.resolve(filePath, '..')
  );
  if (selfRequireFiles.length) {
    selfRequireFiles.forEach((filePath) => {
      entry(filePath);
    });
  }
}

entry(path.resolve(__dirname, '../cjs/index.js'));
