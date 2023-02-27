// index.js 内容
import('./sum').then((m) => {
  console.log(m.default(3, 4));
});
