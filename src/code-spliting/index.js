// index.js 内容
import('./sum').then((m) => {
  console.log(m.default(3, 4));
});

import('./a').then((m) => {
  // console.log(m.default(3, 4));
  m.default();
});

import('./c').then((m) => {
  // console.log(m.default(3, 4));
  m.default();
});
