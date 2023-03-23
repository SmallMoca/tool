const { SyncHook } = require('tapable');

const sleep = new SyncHook();
sleep.tap('foo', () => {
  console.log('foo callback A');
});
sleep.tap('test', () => {
  console.log('test callback A');
});

sleep.tap('bar', () => {
  console.log('bar callback A');
});

sleep.call();
