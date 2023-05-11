(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('lodash')) :
  typeof define === 'function' && define.amd ? define(['lodash'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.lodash));
})(this, (function (lodash) { 'use strict';

  const add = (a, b) => a + b;

  const foo = {
    age: 15,
  };
  const baz = {
    name: 'baz',
  };

  lodash.merge(foo, baz);
  console.log(add(1, 2));

}));
