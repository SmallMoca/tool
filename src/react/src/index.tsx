/*
 * @Author: yuzhicheng
 * @Date: 2023-04-18 11:32:39
 * @Last Modified by: yuzhicheng
 * @Last Modified time: 2023-04-18 16:23:41
 */

import App from './app';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root')!);
root.render(<App />);

// Enable HMR
if (process.env.NODE_ENV === 'development') {
  const HMR = (module as any).hot;
  HMR && HMR.accept && HMR.accept();
}
