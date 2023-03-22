# 条件类型

ts 中的条件类型 使用`extends`关键字，语法类似我们常用的三元表达式

```ts
type R = A extends B ? true : false;
```

只需要 B 能兼容 A ，就代表条件成立，并不需要他们的类型完全相等

**条件类型大部分场景是和泛型搭配使用**
使用条件类型根据传入的泛型 T 更精确标准 返回值的类型

```js
type AddReturnType<T> = T extends number
  ? number
  : T extends bigint
  ? bigint
  : T extends string
  ? string
  : never;

function add<T extends number | bigint | string>(x: T, y: T):AddReturnType<T> {
  return x + (y as any);
}

const res1 = add(1, 2); // number
const res2 = add('1', '2'); // string

```

## infer 关键字

infer 关键字 只能在条件类型中使用，使用 infer 关键字在条件类型中提取某一部分的类型

提取函数返回值的类型

```TS
type Func = (age: number, name: string) => { age: number; name: string };
// 提取函数返回值类型
type FunctioneReturnType<T> = T extends (...args: any[]) => infer R ? R : never;
type RV = FunctioneReturnType<Func>; // { age: number; name: string }

// 提取函数入参参类型
type FuncParams<T> = T extends (...args: infer R) => any ? R : never;
type Params = FuncParams<Func>; // [age: number, name: string]

```

infer 在数组中使用

```TS
type Swap<T extends any[]> = T extends [infer A, infer B] ? [B, A] : T;

type SwapResult1 = Swap<[1, 2]>; // 符合元组结构，首尾元素替换[2, 1]
type SwapResult2 = Swap<[1, 2, 3]>; // 不符合结构，没有发生替换，仍是 [1, 2, 3]
// 提取首尾两个
type ExtractStartAndEnd<T extends any[]> = T extends [
  infer Start,
  ...any[],
  infer End
]
  ? [Start, End]
  : T;

// 调换首尾两个
type SwapStartAndEnd<T extends any[]> = T extends [
  infer Start,
  ...infer Left,
  infer End
]
  ? [End, ...Left, Start]
  : T;

// 调换开头两个
type SwapFirstTwo<T extends any[]> = T extends [
  infer Start1,
  infer Start2,
  ...infer Left
]
  ? [Start2, Start1, ...Left]
  : T;
```

**条件类型配合 infer 实现递归**
获取 Promise 类型最后 resolve 值的类型

```TS
type PromiseValue1<T> = T extends Promise<infer V> ? V : T;

type P1 = PromiseValue1<Promise<{ age: number }>>; //  { age: number }
// 如果 promise 内再嵌套promise 获取不到最后的值类型
type P2 = PromiseValue1<Promise<Promise<{ age: number }>>>; //  Promise<{ age: number }>

// 使用递归， 无论promise 包多少层 我们都能获取到最后结果值的类型
type PromiseValue2<T> = T extends Promise<infer V> ? PromiseValue2<V> : T;
type P3 = PromiseValue2<Promise<Promise<{ age: number }>>> // { age: number }
```

## 分布式条件类型

分布式条件类型是指条件类型在满足一定条件下的执行逻辑

- 联合类型作为泛型参数传入
- 这个泛型是裸露的，没有被包裹
  满足上面两个条件，如果这个泛型应用到条件类型上，会将联合类型的每个成员拆开分别进行一次条件类型判断，最后再将每次条件的判断的结果联合起来

```Ts
type A = 1 | 2 | 3 extends 2 | 3 ? 'true' : 'false'; //fasle

// 联合作为泛型传入 ，触发条件类型分发特性
type Tool2<T> = T extends 2 | 3 ? 'true' : 'false';

type B = Tool2<1 | 2 | 3>; // true | false

```

如果这个泛型 被包裹，不会触发分布式特性

```TS
type Tool3<T> = [T] extends [2 | 3] ? 'true' : 'false';
type C = Tool3<1 | 2 | 3>; // false

```

判断 never
当 never 作为泛型传入，作为条件类型参数的时候 也会直接返回 never ，这种情况 包裹这个泛型 也能不触发直接返回 never 的特性

```TS
type IsNever<T> = [T] extends [never] ? true : fasle

```

判断是否 any

```TS
// isany 利用任何类型 与 any组成交叉类型 都是any 特性去判断
type IsAny<T> = 0 extends 1 & T ? true : false;
```

判断是否 unknown

```TS
type isUnknown<T> = unknown extends T
  ? IsAny<T> extends true
    ? false
    : true
  : false;
```
