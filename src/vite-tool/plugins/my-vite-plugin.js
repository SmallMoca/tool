/*
 * @Author: yuzhicheng
 * @Date: 2023-05-18 18:33:41
 * @Last Modified by: yuzhicheng
 * @Last Modified time: 2023-05-18 18:34:51
 * @Desc Vite plugin
 */

/**
 *
 * @param {*} opts
 * @return {import('vite').Plugin}
 */
function myVitePlugin(opts) {
  return {
    name: 'vite-plugin-my',
    load(id) {
      console.log(id);
    },
  };
}

module.exports = myVitePlugin;
