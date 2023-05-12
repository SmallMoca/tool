/*
 * @Author: yuzhicheng
 * @Date: 2023-05-12 18:16:25
 * @Last Modified by: yuzhicheng
 * @Last Modified time: 2023-05-12 18:54:45
 * rollup image plugin
 */

const { createFilter } = require('@rollup/pluginutils');
const { readFileSync } = require('fs');
const { extname } = require('path');
const miniSvgDataUri = require('mini-svg-data-uri');
// import svgToMiniDataURI from 'mini-svg-data-uri';
const defaults = {
  dom: false,
  exclude: null,
  include: null,
};

const mimeTypes = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
};

const resourceToDataURI = ({ format, isSvg, mime, source }) => {
  return isSvg ? miniSvgDataUri(source) : `data:${mime};${format},${source}`;
};

const constTemplate = ({ dataUri }) => `
  var img = "${dataUri}";
  export default img;
`;

/**
 *
 * @param {{dom:boolean;exclude:string[];include:string[];}} opts
 * @returns {import('rollup').Plugin}
 */
function image(opts) {
  const options = Object.assign({}, defaults, opts);

  const filter = createFilter(options.include, options.exclude);

  return {
    name: 'image',
    load(id) {
      if (!filter(id)) return null;
      const mime = mimeTypes[extname(id)];
      if (!mime) return null;

      const isSvg = mime === mimeTypes['.svg'];
      // 处理一些编码问题
      const format = isSvg ? 'utf-8' : 'base64';

      const source = readFileSync(id, format).replace(/[\r\n]+/gm, '');
      const dataUri = resourceToDataURI({ format, isSvg, mime, source });
      return constTemplate({ dataUri }).trim();
    },
  };
}

module.exports = image;
