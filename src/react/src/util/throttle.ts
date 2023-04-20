/*
 * @Author: yuzhicheng
 * @Date: 2023-04-20 11:38:32
 * @Last Modified by: yuzhicheng
 * @Last Modified time: 2023-04-20 11:45:46
 */

type BaseFunc = (...args: any[]) => any;
export function throttle<T extends BaseFunc>(fn: T, wait: number) {
  let timer: NodeJS.Timer | undefined;
  return function (...params: Parameters<T>) {
    // @ts-expect-error
    const context = this;
    if (!timer) {
      timer = setTimeout(() => {
        fn.apply(context, params);
        timer = undefined;
      }, wait);
    }
  };
}
