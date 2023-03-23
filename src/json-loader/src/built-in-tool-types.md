# 理解 TS 内置类型工具

## 属性修饰类工具类型

这一部分的工具类型主要使用属性修饰、映射类型与索引类型相关

```TS
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


// 扩展 深层次修饰对象属性 为可选
type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

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

```

## 集合工具类型

```TS
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
```

## 结构工具类型

结构类工具类型主要用 条件类型 映射类型 索引类型来实现

```TS
// pick
type Pick<T, K extends keyof T> = {
  [Key in K]: T[Key];
};
// omit
type Omit<T, k extends keyof T> = Pick<T, Difference<keyof T, k>>;

type O1 = Omit<{ name: string; age: number }, 'name'>;

// 根据键值来实现omit pick
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

```

## 匹配模式工具类型

```TS
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
```

## infer 约束

```TS
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

```
