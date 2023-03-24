const {
  SyncHook,
  SyncBailHook,
  SyncWaterfallHook,
  AsyncSeriesHook,
} = require('tapable');
const { flow, add } = require('lodash');

// 创建钩子实例
const sleep = new SyncHook();
sleep.tap('foo', () => {
  console.log('foo callback A');
});

// 调用订阅接口 注册回调
sleep.tap('test', () => {
  console.log('test callback A');
});

sleep.tap('bar', () => {
  console.log('bar callback A');
});

// 调用发布接口
// sleep.call();

// SyncHook 钩子
// 触发后悔按照注册的顺序逐个调用回调，切不关心这些回调的返回值

class SomeBody {
  constructor() {
    this.hooks = {
      sleep: new SyncHook(),
      // SyncBailHook 熔断钩子
      //bail有熔断的意思，bail 类型的钩子在回调队列中，若任意一个回调返回了 非undefined的值，则中断后续处理，直接返回该值
      // SyncBailHook 通常用在发布者需要关心订阅回调运行结果的场景
      sleepBail: new SyncBailHook(),
      // waterfall 钩子的执行逻辑跟 lodash 的 flow 函数有点像，大致上就是将前一个函数的返回值作为参数传入下一个函数
      //              new SyncWaterfallHook(["msg"]),
      // 初始化时必须提供参数，例如上例 new SyncWaterfallHook(["msg"]) 构造函数中，必须传入参数 ["x"] ，用于动态编译 call 的参数依赖，后面我们会讲到 动态编译 的细节；
      // 发布调用 call 时，需要传入初始参数。
      sleepWaterfall: new SyncWaterfallHook(['initMsg']),
    };
  }

  sleepWaterfall() {
    return this.hooks.sleepWaterfall.call('hello');
  }
  sleepBail() {
    return this.hooks.sleepBail.call();
  }

  sleep() {
    // try {
    //   this.hooks.sleep.call();
    // } catch (error) {
    //   console.log(error);
    // }
    this.hooks.sleep.callAsync((err) => {
      if (err) {
        console.log(err.message);
      }
    });
  }
}

const person = new SomeBody();

// 注册
person.hooks.sleep.tap('test', () => {
  console.log('callback A');
});
person.hooks.sleep.tap('test', () => {
  console.log('callback B');
  // throw new Error('callback B 触发报错');
});
person.hooks.sleep.tap('test', () => {
  console.log('callback C');
});
person.hooks.sleep.tap('test', () => {
  console.log('callback D');
});

// person.sleep();

// 输出结果
// callback A
// callback B
// callback C
// callback D

person.hooks.sleepBail.tap('test-bail', () => {
  console.log('test-bail A');
});

person.hooks.sleepBail.tap('test-bail', () => {
  console.log('test-bail B');
  return 'test-bail B 熔断';
});

person.hooks.sleepBail.tap('test-bail', () => {
  console.log('test-bail C');
});

// console.log(person.sleepBail());

function square(n) {
  return n * n;
}

// lodash flow函数 创建一个函数。 返回的结果是调用提供函数的结果，this 会绑定到创建函数。 每一个连续调用，传入的参数都是前一个函数返回的结果。
const addSquere = flow([add, square]);

addSquere(1, 2);
console.log(addSquere(1, 2)); // 9

person.hooks.sleepWaterfall.tap('test sleepWaterfall', (...args) => {
  console.log('test sleepWaterfall A', args);
  return 'foo';
});

person.hooks.sleepWaterfall.tap('test sleepWaterfall', (...args) => {
  console.log('test sleepWaterfall B', args);
  return 'baz';
});

console.log(person.hooks.sleepWaterfall.call('hello'));

const sleepAsyncSeries = new AsyncSeriesHook();
// call风格注册回到
sleepAsyncSeries.tapAsync('async callback', (cb) => {
  console.log('async callback A start');
  setTimeout(() => {
    console.log('async callback A end');
    cb();
  }, 1000);
});

sleepAsyncSeries.tapAsync('async callback', (cb) => {
  console.log('async callback B');
  cb();
});

sleepAsyncSeries.tapAsync('async callback', (cb) => {
  console.log('async callback C');
  cb();
});

// promise风格
sleepAsyncSeries.tapPromise('async-promise', () => {
  return new Promise((r) => {
    console.log('async promise A start');
    setTimeout(() => {
      console.log('async promise A end');
      r('msg');
    }, 1000);
  });
});

sleepAsyncSeries.tapPromise('async-promise', (...args) => {
  console.log('async promise B', args);
  return Promise.resolve('async end');
});
// sleepAsyncSeries.callAsync();
sleepAsyncSeries.promise();
