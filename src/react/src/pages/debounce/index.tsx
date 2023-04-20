// import { debounce } from '@/util/debounce';
import { throttle } from '@/util/throttle';
import debounce from 'lodash/debounce';
import * as util from '@/util/util';
// import { debounce } from 'underscore';

console.log(util);

const scroll = throttle(function () {
  // @ts-expect-error
  console.log('滚动监听  throttle 500', (this as HTMLDivElement).scrollTop);
}, 500);
import React from 'react';
export default function Debounce() {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [text, setText] = React.useState('');
  const handleChange = React.useCallback(
    debounce((e: React.ChangeEvent<HTMLInputElement>) => {
      console.log(e.target.value, 'to search');
      setText(e.target.value);
    }, 500),

    []
  );

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.onscroll = scroll;
    }
  }, []);

  return (
    <div
      ref={scrollRef}
      style={{
        height: '100%',
        width: '100%',
        overflow: 'hidden',
        overflowY: 'scroll',
      }}
    >
      <div>
        <input type='text' onChange={handleChange} />
      </div>
      {Array(200)
        .fill(1)
        .map((_, i) => (
          <p key={i.toString()}>
            {i}-{text}
          </p>
        ))}
    </div>
  );
}
