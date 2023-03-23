// loader 和 plugin 是webpack 对外提供用于扩展webpack的方式
// 这里回顾下 apple 和call 区别，就是传参方式不一样， apply 第二个参数是数据，数组是给目标函数的传参，call 从第二个参数开始都是传递给目标数组的入参

// plugin 本质就是一个 带有apply 方法的类
// webpack 在启动时候会调用插件对象的apply 方法，并以参数方法传递核心对象 compiler 对象 插件内可以注册 compiler 对象及其子对象的钩子(Hook)回调

module.exports = class SomePlugin {
  constructor() {
    // todo constructor
  }
  apply(compiler) {
    // 注册 thisCompliation 钩子
    // thisCompilation  初始化 compilation 时调用，在触发 compilation 事件之前调用。这个钩子 不会 被复制到子编译器
    compiler.hooks.thisCompilation.tap('SomePlugin', (compilation) => {
      // compilation.addModule('');
      console.log('初始化compilation');
    });

    compiler.hooks.compilation.tap('SomePlugin', () => {
      console.log('hooks.compilation  => 正式开始构建时触发；');
    });

    compiler.hooks.make.tap('SomePlugin', () => {
      console.log('hooks.make => 正式开始构建时触发；');
    });

    // compiler.hooks.optimizeChunks.tap('SomePlugin', () => {
    //   console.log(
    //     'hooks.optimizeChunks => seal 函数中，chunk 集合构建完毕后触发；'
    //   );
    // });

    compiler.hooks.done.tap('SomePlugin', () => {
      console.log('hooks.done =>编译完成后触发');
    });
  }
};
