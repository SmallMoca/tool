/*
 * @Author: yuzhicheng
 * @Date: 2023-03-15 11:50:41
 * @Last Modified by: yuzhicheng
 * @Last Modified time: 2023-03-24 13:47:02
 */

console.log('run log');

declare const module: any;
const HMR = (module as any).hot;
HMR && HMR.accept && HMR.accept();
