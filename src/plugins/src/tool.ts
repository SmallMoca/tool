// 函数类型的协变和逆变
class Animal {
  asPet() {}
}

class Dog extends Animal {
  bark() {}
}

class Corgi extends Dog {
  cute() {}
}

// base
type A = (args: Dog) => Dog;

type B = (args: Corgi) => Corgi;
type C = (args: Animal) => Animal;

type D = (args: Animal) => Corgi;
type E = (args: Animal) => Dog;
type F = (args: Corgi) => Dog;

type ResB = B extends A ? 'true' : 'false'; // false
type ResC = C extends A ? 'true' : 'false'; // false
type ResD = D extends A ? 'true' : 'false'; // true
type ResE = E extends A ? 'true' : 'false'; // true
type ResF = F extends A ? 'true' : 'false'; // false

// 对于一个接受 Dog 类型并返回 Dog 类型的函数，我们可以这样表示：

type DogFactory = (args: Dog) => Dog;

function transformDogAndBark(dogFactory: DogFactory) {
  const dog = dogFactory(new Dog());
  dog.bark();
}
// 上面函数中 参数类型 要求传入的是一个 Dog => Dog 的函数类型
// dogFactory 会在函数内部被调用
// 1. 如果我们传入 Corgi => Corgi类型参数 到 transformDogAndBark

function makeDogBark(dog: Dog) {
  dog.bark();
}
makeDogBark(new Corgi()); // 没问题
// makeDogBark(new Animal()); // 不行

// type A = (dog: Dog) => Dog;

// type B =
// 协变和逆变 使我们比较函数类型层级的一种理论

// 函数类型的参数类型使用子类型逆变的方式确定是否成立，而返回值类型使用子类型协变的方式确定。

// 参考链接 https://jkchao.github.io/typescript-book-chinese/tips/covarianceAndContravariance.html#%E4%B8%80%E4%B8%AA%E6%9C%89%E8%B6%A3%E7%9A%84%E9%97%AE%E9%A2%98
