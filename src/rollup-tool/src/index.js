import add from 'utils/add';
import logo from 'assets/logo.png';
// import { merge } from 'lodash-es';

// const foo = {
//   age: 15,
// };
// const baz = {
//   name: 'bazddd',
// };

// merge(foo, baz);
console.log(add(1, 2));
// console.log(logo);
const img = new Image();
img.src = logo;
document.body.append(img);

const A =
  false ||
  (true && false) ||
  (true && false) ||
  false ||
  (true && 0) ||
  (1 && 'c');
