import React from 'react';
import S from './clock-in.module.less';
import classNames from 'classnames';
import logoSrc from '@/assets/logo.png';
import { debounce } from 'lodash-es';

import { ReactComponent as ReactLogo } from '@/assets/svg/react-logo.svg';

import packageUrl from '@/assets/json/package.json?url';
import packageRaw from '@/assets/json/package.json?raw';
// ?url: 表示获取资源的路径，这在只想获取文件路径而不是内容的场景将会很有用。
// ?raw: 表示获取资源的字符串内容，如果你只想拿到资源的原始内容，可以使用这个后缀。
// ?inline: 表示资源强制内联，而不是打包成单独的文件
const Active = () => {
  return <img className={S.logo} src={logoSrc} alt='logo' />;
};

const input = debounce((e) => {
  console.log(e.target.value);
}, 300);

export default function ClockIn() {
  const [count, setCount] = React.useState(0);
  return (
    <div className={S.clockIn}>
      <input type='text' placeholder='搜索' onChange={input} />
      <div className={S.clockList}>
        {Array(3)
          .fill(1)
          .map((_, idx) => (
            <div className={S.clockInItem} key={idx}>
              <div
                className={classNames(S.am, {
                  // [S.active]: count >= idx * 2 + 1,
                })}
              >
                {count >= idx * 2 + 1 ? <Active /> : null}
              </div>
              <div
                className={classNames(S.pm, {
                  // [S.active]: count >= idx * 2 + 2,
                })}
              >
                {count >= idx * 2 + 2 ? <ReactLogo /> : null}
              </div>
            </div>
          ))}
      </div>

      <div className={S.clockInBtn} onClick={() => setCount((pre) => pre + 1)}>
        打卡
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {packageUrl}
        {packageRaw}
      </div>
    </div>
  );
}
