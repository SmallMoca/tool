'use strict';

var lodashEs = require('lodash-es');

const add = (a, b) => a + b;

const foo = {
  age: 15,
};
const baz = {
  name: 'bazddd',
};

lodashEs.merge(foo, baz);
console.log(add(1, 2));
