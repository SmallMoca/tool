// lodash.index.js

import _ from 'lodash';

console.log(_.join(['Another', 'module', 'loaded!'], ' '));

import(/* webpackChunkName: "foo" */ './lodash.foo').then((m) => {
  console.log(m.name);
});

import(/* webpackChunkName: "bar" */ './lodash.bar').then((m) => {
  console.log(m.name);
});
