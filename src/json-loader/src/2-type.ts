// 类型编程进阶
import { expectType } from 'tsd';

// 属性修饰进阶

type MyPartial<T> = {
  [K in keyof T]?: T[K];
};

type DeepPartial<T extends object> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

expectType<MyPartial<{ name: string; age: number }>>({});
expectType<DeepPartial<{ name: string; age: number; info: { msg: string } }>>(
  {}
);

export type DeepRequired<T extends object> = {
  [K in keyof T]-?: T[K] extends object ? DeepRequired<T[K]> : T[K];
};

// 也可以记作 DeepImmutable
export type DeepReadonly<T extends object> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K];
};

export type DeepMutable<T extends object> = {
  -readonly [K in keyof T]: T[K] extends object ? DeepMutable<T[K]> : T[K];
};

// {} 是所有类型 是Object的字面量类型，它表示任何非 null /undefined的值
type MyNonNullable<T> = T & {};

type NonNullableStuct = MyNonNullable<'string' | { age: string } | undefined>;

type T1 = MyNonNullable<undefined | null>;

export type DeepNonNullable<T extends object> = {
  [K in keyof T]: T[K] extends object
    ? DeepNonNullable<T[K]>
    : MyNonNullable<T[K]>;
};

// 递排除所有 null 和undefined的属性

// 1 先写个排除首层排除 null 和undefined的 工具
type ExtractNonNullableKey<T> = T extends object
  ? {
      [K in keyof T]: T[K] extends undefined | null ? never : K;
    }[keyof T]
  : never;

type A = ExtractNonNullableKey<{ age: string; name: undefined }>;

// 获取
type TypeofExcludeWithType<T extends object, ET> = T extends object
  ? {
      [K in keyof T]: T[K] extends ET ? never : K;
    }[keyof T]
  : never;

type BaseType = {
  age: number;
  name: string;
  gender: undefined;
  a: number;
  info: {
    msg: string;
    a: undefined;
    c: null;
  };
};

// 获取所有不是 string 类型的键名
type ANSER1 = TypeofExcludeWithType<BaseType, string>; //  "age" | "info"
// 获取所有不是 undefined 类型的键名
type ANSER = TypeofExcludeWithType<BaseType, undefined>; //  "name" | "age" | "info"

type OmitWithNonNullable<T> = T extends object
  ? {
      [K in TypeofExcludeWithType<T, undefined | null>]: T[K];
    }
  : T;

type ANSER3 = OmitWithNonNullable<BaseType>;

// 剔除类型为指定类型的属性
type OmitWithType<T, ET> = T extends object
  ? {
      [K in TypeofExcludeWithType<T, ET>]: T[K];
    }
  : T;
type ANSER4 = OmitWithType<BaseType, string>;

// 深度剔除
type DeepOmitWithType<T, ET> = T extends object
  ? {
      [K in TypeofExcludeWithType<T, ET>]: T[K] extends object
        ? DeepOmitWithType<T[K], ET>
        : T[K];
    }
  : T;

type ANSER5 = DeepOmitWithType<BaseType, string>;
type ANSER6 = DeepOmitWithType<BaseType, null | undefined>;

// 键值反转

type TEST = BaseType[keyof BaseType];

type Base1 = {
  name: 'value';
  age: '123';
  info: { msg: string };
};
type E = EunmK<Base1[keyof Base1]>;

type EunmK<T> = T extends keyof any ? T : never;

type ReverseKeyValue<T> = T extends object
  ? {
      [VK in EunmK<T[keyof T]>]: {
        [TK in keyof T]: T[TK] extends VK ? TK : never;
      }[keyof T];
    }
  : T;

type ANSER7 = ReverseKeyValue<{
  name: 'value';
  age: '123';
  info: { msg: string };
}>;
