// index.js
import { name as common } from './common';

import(/* webpackChunkName: "foo" */ './foo').then((m) => {
  console.log(m.name);
});

import(/* webpackChunkName: "bar" */ './bar').then((m) => {
  console.log(m.name);
});

console.log(common);
