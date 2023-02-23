const log = require('log');
const m = require('./module/index');
let count = 0;
module.exports = {
  changeCount: () => {
    count = 10;
    return count;
  },
  count,
  add: (a, b) => {
    return a + b;
  },
};
