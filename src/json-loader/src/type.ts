/*
 * @Author: yuzhicheng
 * @Date: 2023-03-21 09:42:40
 * @Last Modified by: yuzhicheng
 * @Last Modified time: 2023-03-23 18:32:04
 * @Title 结构化类型系统
 */

class Cat {
  eat() {}
}

class Dog {
  eat() {}
  bark() {}
}

function feedCat(cat: Cat) {
  cat.eat();
}

feedCat(new Dog()); // feed 要求传入要求的参数类型时一个Cat的实例，但是这里传入一个 Dog的实例 也是可以的，这是因为结构化类型系统的存在，它会检查传入的参数是否包含要求的属性和方法，只要包含就可以，不需要严格的类型匹配

export declare class TagProtector<T extends string> {
  protected __tag__: T;
}

export type Nominal<T, U extends string> = T & TagProtector<U>;
export type CNY = Nominal<number, 'CNY'>;

export type USD = Nominal<number, 'USD'>;

type C = number & {
  __tag__: string;
};

class MyNumber extends Number {
  __tag__: string;
  constructor(value: number, tag: string) {
    super(value);
    this.__tag__ = tag;
  }
}

// 这里相当于相当于给原始类型新增属性，所以这个联合类型是兼容的
type A = { __tag__: string } & number; // { __tag__: string } & number;
type B = number & string; // never

type Result22 = Object extends any ? 1 : 2; // 1
type Result23 = Object extends unknown ? 1 : 2; // 1
// any 可以表达为任何类型 所以这里可能为1 或 2
type Result24 = any extends Object ? 1 : 2; // 1 | 2
// unknown只能赋值给 unknown 和 any 所以这里是2
type Result25 = unknown extends Object ? 1 : 2; // 2

type Result26 = any extends 'linbudu' ? 1 : 2; // 1 | 2
type Result27 = any extends string ? 1 : 2; // 1 | 2
type Result28 = any extends {} ? 1 : 2; // 1 | 2
type Result29 = any extends never ? 1 : 2; // 1 | 2

type Result31 = any extends unknown ? 1 : 2; // 1
type Result32 = unknown extends any ? 1 : 2; //

type Result33 = never extends 'linbudu' ? 1 : 2; // 1

// 类型逻辑计算，条件类型 与infer
// 使用extends关键字来判断两个类型时间是否兼容 ，从而实现条件类型

type IsString<T> = T extends string ? true : false;

type Result34 = IsString<'linbudu'>; // true
type Result35 = IsString<1>; // false

// 条件类型嵌套
type LiteralType<T> = T extends string
  ? 'string'
  : T extends number
  ? 'number'
  : T extends boolean
  ? 'boolean'
  : T extends undefined
  ? 'undefined'
  : T extends Function
  ? 'function'
  : 'object';

type Result36 = LiteralType<'linbudu'>; // string
type Result37 = LiteralType<1>; // number
type Result38 = LiteralType<true>; // boolean

type AddReturnType<T> = T extends number
  ? number
  : T extends bigint
  ? bigint
  : T extends string
  ? string
  : never;
// 条件类型的实际应用
function add<T extends number | bigint | string>(x: T, y: T): AddReturnType<T> {
  return x + (y as any);
}

const res1 = add(1, 2); // number
const res2 = add('1', '2'); // string

// infer 关键字 用于提取条件类型中的类型变量，只能在条件类型中使用
// ts 中支持通过infer 关键字来在条件类型中提取类型的一部分信息
// infer是 inference 的缩写，意为推断，如 infer R 中 R 就表示 待推断的类型。 infer 只能在条件类型中使用，
// 因为我们实际上仍然需要类型结构是一致的，比如上例中类型信息需要是一个函数类型结构，我们才能提取出它的返回值类型

// 条件类型 infer 在函数类型中应用
// 提取函数的返回值类型

type Func = (age: number, name: string) => { age: number; name: string };

type FunctioneReturnType<T> = T extends (...args: any[]) => infer R ? R : never;
type RV = FunctioneReturnType<Func>; // { age: number; name: string }

type ADD = FunctioneReturnType<typeof add>; // number | string | bigint

type FuncParams<T> = T extends (...args: infer R) => any ? R : never;
type Params = FuncParams<Func>; // [age: number, name: string]

// 条件类型infer 在数组类型中应用
// 体操一下
// 替换元组中的类型位置 infer 关键字还能像 ...剩余操作符一样 将一组类型提取一个一个类型
type Swap<T extends any[]> = T extends [infer T1, infer T2, ...infer T3]
  ? [T2, T1, ...T3]
  : never;

type Result39 = Swap<[string, number, boolean]>;
// 替换守卫
type SwapStartAndEnd<T extends any[]> = T extends [
  infer T1,
  ...infer T2,
  infer T3
]
  ? [T3, ...T2, T1]
  : T;

type Result40 = SwapStartAndEnd<[string, number, boolean, undefined]>; //  [boolean, number, string]

// infer 关键字 在接口类型上的应用
type ExtractOALLVT<T extends object> = T extends {
  [K in keyof T]: infer V;
}
  ? V
  : never;

type ALLVT = ExtractOALLVT<{ name: string; age: number; onLine: boolean }>;

// 提取指定键名的值类型
type PickWithPropValueTypes<T, K extends keyof T> = T extends {
  [KK in K]: infer R;
}
  ? R
  : never;

type NT = PickWithPropValueTypes<
  { name: string; age: number; onLine: boolean },
  'onLine'
>;

type PropTypeResult1 = PickWithPropValueTypes<{ name: string }, 'name'>; // string

type PropTypeResult2 = PickWithPropValueTypes<
  { name: string; age: number },
  'name' | 'age'
>;

type Test1 = {
  name: string;
};

type Test2 = {
  name: string;
  age: number;
};

type TestR = Test2 extends Test1 ? true : false;

// 反转键值和键名
type ReverseKeyValue<T extends Record<string, unknown>> = T extends Record<
  infer K,
  infer V
>
  ? Record<V & string, K>
  : never;

type ReverseKeyValueResult1 = ReverseKeyValue<{ key: 'value'; age: '123' }>; // { "value": "key" }

type Reverse<T extends Record<keyof T, keyof any>> = {
  // 这里 用value 当key
  [V in T[keyof T]]: {
    [TempK in keyof T]: T[TempK] extends V ? T[TempK] : never;
  }[keyof T];
};

type Reverse2<T extends Record<keyof T, keyof any>> = T extends Record<
  infer K,
  infer V
>
  ? {
      [VK in V & keyof any]: {
        [TK in K]: T[TK] extends VK ? T[TK] : never;
      }[K];
    }
  : never;

type AnyK = keyof any;

type Base = { name: 'value'; age: '123' };

type VS = Base extends Record<string, infer V> ? V : never;

type T2 = Reverse<{ name: 'value'; age: '123' }>;
type TA = Reverse2<{ name: 'value'; age: '123' }>;

type PATTERN<T> = {
  [K in keyof T]: T[K];
};

// infer 在递归场景的应用
// 提取promise resolve 返回的类型
type PromiseValue1<T> = T extends Promise<infer V> ? V : T;

type P1 = PromiseValue1<Promise<{ age: number }>>;

// 支持任意层级
type PromiseValue2<T> = T extends Promise<infer V> ? PromiseValue2<V> : T;

type P2 = PromiseValue2<Promise<Promise<number>>>; //  number

// 条件类型的分布特性 这是条件类型在满足一定条件下的执行逻辑
type Condition<T> = T extends 1 | 2 | 3 ? T : never;

// 1 | 2 | 3
type Res1 = Condition<1 | 2 | 3 | 4 | 5>;

// never
type Res2 = 1 | 2 | 3 | 4 | 5 extends 1 | 2 | 3 ? 1 | 2 | 3 | 4 | 5 : never;

// isNever
type IsNever<T> = [T] extends [never] ? true : false;

type N1 = IsNever<never>;
type N2 = IsNever<1>;

// isany 利用任何类型 与 any组成交叉类型 都是any 特性去判断
type IsAny<T> = 0 extends 1 & T ? true : false;

type AR1 = IsAny<any>;
type AR2 = IsAny<{}>;

// isUnknown
type isUnknown<T> = unknown extends T
  ? IsAny<T> extends true
    ? false
    : true
  : false;

type U1 = isUnknown<any>;
type U2 = isUnknown<unknown>;

// ts内置工具类基础
// 内置的属性修饰类工具
// Partial Required Readonly 等
// 他们的实现
type MyPartial<T> = {
  [K in keyof T]?: T[K];
};

type MyRequired<T> = {
  [K in keyof T]-?: T[K];
};

type MyReadonly<T> = {
  readonly [K in keyof T]: T[K];
};

type BaseType = {
  userId: string;
  age: number;
  name: string;
};

// {userId?: string | undefined;age?: number | undefined;name?: string | undefined;}
type PartialBaseType = MyPartial<BaseType>;
type RequiredBaseType = MyRequired<PartialBaseType>; // {userId: string;age: number;name: string;}
type ReadonlyBaseType = MyReadonly<RequiredBaseType>; //  {readonly userId: string;readonly age: number;readonly name: string;}

// 注意點 可选标记 不等于修改此属性为 原始类型 | undefined
interface Foo {
  optional: string | undefined;
  required: string;
}

// 类型 "{ required: string; }" 中缺少属性 "optional"，但类型 "Foo" 中需要该属性。
const foo1: Foo = {
  required: '1',
};

const foo2: Foo = {
  required: '1',
  optional: undefined,
};

// 扩展 深层次修饰对象属性 为可选
type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

type DeepR1 = DeepPartial<{ name: string; info: { age: number } }>;

// 基于传入的键名 修饰 指定部分属性可选
type PickPartial<T, K extends keyof T> = Partial<Pick<T, K>> & Omit<T, K>;

type PickPartial2<T, K extends keyof T> = keyof T extends infer Ak
  ? Ak extends K
    ? never
    : Ak extends keyof T
    ? { [KKK in Ak]: number } & { [KK in K]?: T[KK] }
    : never
  : never;

type PickPartial3<T, K extends keyof T, AK = keyof T> = AK extends K
  ? never
  : AK extends keyof T
  ? { [KKK in AK]: T[KKK] } & { [KK in K]?: T[KK] }
  : never;

type A1 = PATTERN<
  PickPartial3<{ name: string; info: { age: number } }, 'name' | 'info'>
>;

// 集合工具类型
// 并集
type Union<A, B> = A | B;
// 交集
type Intersection<A, B> = A extends B ? A : never;
// 差集
type Difference<A, B> = A extends B ? never : A;
// 补集
type Complement<A, B extends A> = A extends B ? never : A;

type D1 = Union<1, 2>;
type D2 = Intersection<1 | 2 | 3, 1 | 2>; // 1|2
type D3 = Difference<1 | 2 | 4, 1 | 4>; // 2
// 结构类工具类型

// pick
type Pick<T, K extends keyof T> = {
  [Key in K]: T[Key];
};
// omit
type Omit<T, k extends keyof T> = Pick<T, Difference<keyof T, k>>;

type O1 = Omit<{ name: string; age: number }, 'name'>;

// 更具键值来实现omit pick
interface Base1 {
  name: string;
  age: number;
  info: {
    desc: string;
  };
  func: () => void;
  c?: () => void;
}

type ExtractWithType<D, T> = {
  [K in keyof D]: D[K] extends T ? K : never;
}[keyof D];
type B1 = ExtractWithType<Base1, string>;

type OmitWithType<O, T> = {
  [K in Exclude<keyof O, ExtractWithType<O, T>>]: O[K];
};

type PickWithType<O, T> = {
  [P in ExtractWithType<O, T>]: O[P];
};

type B2 = PickWithType<Base1, string>;
type B3 = OmitWithType<Base1, string>;

type FirstParameter<T extends Function> = T extends (
  firstArg: infer F,
  ...args: any
) => any
  ? F
  : never;

type FuncFoo = (arg: number) => void;
type FuncBar = (...args: string[]) => void;

type FooFirstParameter = FirstParameter<FuncFoo>; // number

type BarFirstParameter = FirstParameter<FuncBar>; // string

// infer 约束
type FirstArrayItemType1<T extends any[]> = T extends [infer P, ...any[]]
  ? P extends string
    ? P
    : never
  : never;

// 语法上更精简 可读性高
type FirstArrayItemType2<T extends any[]> = T extends [
  infer P extends string,
  ...any[]
]
  ? P
  : never;
