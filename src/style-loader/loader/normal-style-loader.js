module.exports = function (source) {
  return `
function injectCss(css) {
  const style = document.createElement('style')
  style.appendChild(document.createTextNode(css))
  document.head.appendChild(style)
}
injectCss(\`${source}\`)
  `;
};

// module.exports = function (source) {
//   // const result = JSON.parse(source);
//   // result.age = '22';
//   // return `module.exports = ${JSON.stringify(result)};`;
//   // return source;
//   return `
// function injectCss(css) {
//   const style = document.createElement('style')
//   style.appendChild(document.createTextNode(css))
//   document.head.appendChild(style)
// }
// injectCss(\`${source}\`)
//   `;
// };
