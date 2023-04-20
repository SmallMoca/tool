/*
 * @Author: yuzhicheng
 * @Date: 2023-04-19 11:55:37
 * @Last Modified by: yuzhicheng
 * @Last Modified time: 2023-04-20 14:02:02
 */
export function debounce(fn, wait = 200) {
  let timer;
  return function debounced(...args) {
    let context = this;
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(context, args);
    }, wait);
  };
}

// js this
// 四种this绑定的规则
function foo() {
  console.log(this.bar);
}
// 默认绑定 - 作为普通函数调用  this 非严格模式下 this 默认指向 全局对象，浏览器下就是window 对象，严格模式下是undefined
// foo(); // undefined
// 隐式绑定  作为对象的方法调用 隐式绑定到该对象下
const obj = {
  bar: 'bar field',
  foo,
};

obj.foo(); // bar field

// 显示绑定 bind call  apply
const fooBindObj = foo.bind(obj);
fooBindObj();
foo.call({ bar: 'bar call' });
foo.apply({ bar: 'bar apply' });

// 关键字new 绑定
class Foo {
  bar = 'Foo bar';
  foo = function () {
    console.log(this.bar);
  };
}

const foo1 = new Foo();
foo1.foo();

foo1.foo.apply({ bar: 'bind obj foo' });

// 箭头函数
// 箭头函数无视上面四种规则
const arrowsFoo = () => {
  console.log(this);
};
arrowsFoo.call({ bar: 'bar call' }); // undefined
arrowsFoo.apply({ bar: 'bar apply' }); // undefined
class HasArrorwsFooClass {
  bar = 'HasArrorwsFooClass foo';
  foo = () => {
    console.log(this.bar);
  };
}

const arrowsFoo1 = new HasArrorwsFooClass();
arrowsFoo1.foo();

arrowsFoo1.foo.apply({ bar: 'bar' }); // HasArrorwsFooClass foo

// new 实例化过程
// 1、创建一个空的新对象
// 2、把这个对象链接到原型对象上
// 3、这个对象被绑定为this
// 4、如果这个函数不返回任何东西  那么就默认返回this

// 箭头函数 和普通函数的区别

// bind
// call
// apply

// 实现继承

// js原型链

// 词语作用域

// promise
// promise.all
// promise.race
// 微任务 宏任务
