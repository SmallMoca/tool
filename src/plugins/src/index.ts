/*
 * @Author: yuzhicheng
 * @Date: 2023-03-15 11:50:41
 * @Last Modified by: yuzhicheng
 * @Last Modified time: 2023-03-27 17:00:27
 */

// console.log('run log');
import aImg from './images/a.jpg';

(() => {
  const img = document.createElement('img');
  img.src = aImg;
  img.style.width = '200px';
  document.body.append(img);
})();

declare const module: any;
const HMR = (module as any).hot;
HMR && HMR.accept && HMR.accept();
