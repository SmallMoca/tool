/*
 * @Author: yuzhicheng
 * @Date: 2023-04-19 10:06:08
 * @Last Modified by: yuzhicheng
 * @Last Modified time: 2023-05-09 18:15:46
 */

// 防抖
export function debounce<T extends (...arg: any) => any>(
  fn: T,
  wait: number = 0
) {
  let timer: NodeJS.Timer;
  return function (...args: Parameters<T>) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...(args as any));
    }, wait);
  };
}

export function throttle() {}
