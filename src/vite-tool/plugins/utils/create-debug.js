import debug from 'debug';

const NS_PREFIX = '@xm';

/**
 * 创建指定命名空间的 debug logger
 *
 * @export
 * @param {string} namespace 命名空间
 */
export default function createDebugger(namespace) {
  return debug(`${NS_PREFIX}:${namespace}`);
}
