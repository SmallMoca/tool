import { add } from './util';
import { merge } from 'lodash-es';

const foo = {
  age: 15,
};
const baz = {
  name: 'bazddd',
};

merge(foo, baz);
console.log(add(1, 2));

const A =
  false ||
  (true && false) ||
  (true && false) ||
  false ||
  (true && 0) ||
  (1 && 'c');
