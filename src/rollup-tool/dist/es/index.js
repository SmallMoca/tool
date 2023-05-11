import { merge } from 'lodash-es';

const add = (a, b) => a + b;

const foo = {
  age: 15,
};
const baz = {
  name: 'bazddd',
};

merge(foo, baz);
console.log(add(1, 2));
