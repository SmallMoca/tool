// index.js 内容

setTimeout(() => {
  import('./sum').then((m) => {
    console.log(m.default(3, 4));
  });
}, 3000);
