import { changeCount, count } from './esm';
import { changeCount as cjsChangeCount } from '../cjs/sum';

console.log(count);
changeCount();
console.log(cjsChangeCount());
console.log(count);
