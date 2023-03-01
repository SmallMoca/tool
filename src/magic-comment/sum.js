// sum.js 内容
const sum = (...args) => args.reduce((x, y) => x + y, 1);
setTimeout(() => {
  import('./add').then((m) => {
    console.log(m.default(3, 4));
  });
}, 3000);

export default sum;
