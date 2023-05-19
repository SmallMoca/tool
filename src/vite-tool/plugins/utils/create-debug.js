process.env.DEBUG = 'plugin:*';
// import debug from 'debug';
const NAMESPACE = 'plugin';
const debug = require('debug');

export function createDebug(name) {
  const log = debug(`${NAMESPACE}:${name}`);
  return log;
}
