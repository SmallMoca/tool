/*
 * @Author: yuzhicheng
 * @Date: 2023-04-18 11:32:39
 * @Last Modified by: yuzhicheng
 * @Last Modified time: 2023-04-19 16:14:03
 */

import App from './app';
import { createRoot } from 'react-dom/client';
import 'antd/dist/antd.css';

const root = createRoot(document.getElementById('root')!);
root.render(<App />);

// Enable HMR
if (process.env.NODE_ENV === 'development') {
  const HMR = (module as any).hot;
  HMR && HMR.accept && HMR.accept();
}
