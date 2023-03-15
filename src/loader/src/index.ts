/*
 * @Author: yuzhicheng
 * @Date: 2023-03-15 11:50:41
 * @Last Modified by: yuzhicheng
 * @Last Modified time: 2023-03-15 14:31:55
 */

// import { Item } from './foo';
import resultJson from './result.customize.json';

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
  }
})();

declare const module: any;
const HMR = (module as any).hot;
HMR && HMR.accept && HMR.accept();
