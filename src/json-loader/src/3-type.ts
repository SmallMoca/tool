// 模板字符串类型的基础使用

type World = 'world';
type Greeting = `${number}-${World}`;

const msg: Greeting = '123-world';

type PHONE_NAME = 'iphoneX' | 'iphone 11' | 'iphone 12';
type MEMORY = '64g' | '128g' | '256g';
type ItemType = 'official' | 'second-hand';

type IPHONE_SKU = `${PHONE_NAME}-${MEMORY}-${ItemType}`;

const p1: IPHONE_SKU = 'iphone 11-128g-official';

type EmailLocaleIDS = 'a' | 'b';
type FooterLocaleIds = 'c' | 'd';

type AllIDs = `${EmailLocaleIDS | FooterLocaleIds}_id`;

type Lang = 'en' | 'ja' | 'cn';

type LocaleMessageIds = `${AllIDs}_${Lang}`;

const paddedObject = {
  firstName: 'John',
  lastName: 'Doe',
  age: 42,
  d: 3,
};

type PropEventSource<T> = {
  on<K extends string & keyof T>(
    eventName: `${K}Changed`,
    callback: (value: T[K]) => void
  ): void;
};

type MakeWatchedObject<T> = (obj: T) => T & PropEventSource<T>;

// 寫一個mackewatchedObject
const makeWatchedObject = <T>(obj: T): T & PropEventSource<T> => {
  return {
    ...obj,
    on(eventName, callback) {
      // ...
    },
  };
};

const person = makeWatchedObject(paddedObject);

person.on('firstNameChanged', (value) => {});

type Greeting1 = 'Hello, world';

type ShoutyGreeting1 = Uppercase<Greeting1>;
type ShoutyGreeting2 = Lowercase<Greeting1>;
type Greeting2 = Capitalize<ShoutyGreeting2>;
type UppercaseGreeting = 'HELLO WORLD';
type UncomfortableGreeting = Uncapitalize<UppercaseGreeting>;

// 模板字符串类型 结合索引类型 映射类型
// 索引签名组成的撒三部分 索引签名查询 keyof 关键字 索引签名访问  索引签名类型

// 重映射语法
type CopyWithRename<T extends object> = {
  [K in keyof T as `modified_${number & K}`]: T[K];
};
interface Foo {
  name: string;
  age: number;
  1: 2;
}
type CopyBase = CopyWithRename<Foo>;

// type A = string & symbol

type PickByValueType<T extends object, Type> = {
  [K in keyof T as T[K] extends Type ? K : never]: T[K];
};

type FooString = PickByValueType<Foo, string>;

type OmitByValueType<T extends object, TK> = {
  [K in keyof T as T[K] extends TK ? never : K]: T[K];
};

type FooOmitString = OmitByValueType<Foo, string>;

type KekofWithType<T extends object, TT> = {
  [K in keyof T]: T[K] extends TT ? K : never;
}[keyof T];

type K = KekofWithType<Foo, string>;

type PropsKey = keyof any;

interface Bar {
  name: 'yzc';
  age: '11';
  123: 321;
}

type ReverseKeyValue<T extends object> = {
  [K in keyof T as T[K] & keyof any]: K;
};

type R = ReverseKeyValue<Bar>;

enum A {
  A_TYPE = 'a',
  B_TYPE = 'b',
  C_TYPE = 'c',
}
type Flatten<T> = { [K in keyof T]: T[K] };

type AV = `${A}`;

type A_TYPE = Flatten<typeof A>;

type A_KEYS = keyof typeof A;

enum C {
  A_TYPE,
  B_TYPE,
  C_TYPE,
}
type C_KEYS = keyof typeof C;

// 提取enum Key 为联合类型

// 提取 enum 值为联合类型
type EV = `${C}`; // "0" | "1" | "2"
type EK = keyof typeof C; //  "A_TYPE" | "B_TYPE" | "C_TYPE"

// 模板类型进阶
type Events = 'change' | 'blur' | 'load';
type EventHandle = `on${Capitalize<Events>}`;

type ExtractEventName<T extends string> = T extends `on${infer name}`
  ? Uncapitalize<name>
  : never;

type EventName = ExtractEventName<EventHandle>;

//  基于模板类型的 include
type Include<
  Str extends string,
  Search extends string
> = Str extends `${infer _F}${Search}${infer _E}` ? true : false;

type B1 = Include<'baidu', 'du'>;
type B2 = Include<'baidu', 'b'>;
type B3 = Include<'', ''>; // false
type B4 = Include<' ', ''>;

type BetterInclude<Str extends string, Search extends string> = Str extends ''
  ? Search extends Str
    ? true
    : false
  : Include<Str, Search>;
