/*
 * @Author: yuzhicheng
 * @Date: 2023-03-15 11:50:41
 * @Last Modified by: yuzhicheng
 * @Last Modified time: 2023-03-21 09:42:11
 */

// import { Item } from './foo';
import resultJson from './result.customize.json';
import yamlResult from './result.yaml';
import imgResouce from './img.png';

interface Params {
  name: string;
  age: number;
}

function mockFetch(params: Params): Promise<{ data: Params }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data: params });
    }, 1000);
  });
}

(async () => {
  const data = await mockFetch({ name: 'yuzhicheng', age: 18 });
  console.log(data);
})();

const container = document.getElementById('root');

(async () => {
  const _ = await import('./foo');
  if (container) {
    const jsonStr = Object.entries(resultJson)
      .map(([key, value]) => `${key}: ${value}`)
      .join(',');
    container.innerHTML = jsonStr;
    const div = document.createElement('div');
    div.innerHTML = JSON.stringify(yamlResult);
    document.body.appendChild(div);
    const img = document.createElement('img');
    img.src = imgResouce;
    document.body.append(img);
  }
})();

declare const module: any;
const HMR = (module as any).hot;
HMR && HMR.accept && HMR.accept();

type Tool<T> = T extends 1 ? true : false;

type R = 1 extends 1 | 2 ? true : false;
type R2 = 1 | 2 extends 1 ? true : false;
type R3 = Tool<1 | 2>;

type A = 1 | 2 | 3 extends 2 | 3 ? 'true' : 'false'; //fasle

// 联合作为泛型传入 ，触发条件类型分发特性
type Tool2<T> = T extends 2 | 3 ? 'true' : 'false';

type B = Tool2<1 | 2 | 3>; // true | false

// 我们项目有时候不需要这些分布式特性，我们直接包裹这个泛型
// 如果这个泛型 被包裹，不会触发分布式特性
type Tool3<T> = [T] extends [2 | 3] ? 'true' : 'false';
type C = Tool3<1 | 2 | 3>; // false
