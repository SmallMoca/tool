module.exports = function (source) {
  const result = JSON.parse(source);
  result.age = '22';
  return `module.exports = ${JSON.stringify(result)};`;
};
