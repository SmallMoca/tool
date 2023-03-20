/*
 * @Author: yuzhicheng
 * @Date: 2023-03-15 11:50:41
 * @Last Modified by: yuzhicheng
 * @Last Modified time: 2023-03-20 18:39:54
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
