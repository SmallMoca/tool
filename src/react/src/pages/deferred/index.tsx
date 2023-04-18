import React from 'react';
import { useState, useDeferredValue } from 'react';
import { memo } from 'react';

function SlowItem(props: any) {
  let startTime = performance.now();
  while (performance.now() - startTime < 1) {
    // Do nothing for 1 ms per item to emulate extremely slow code
  }

  return <p className='item'>Text: {props.text}</p>;
}
const SlowList = memo<{ text: string }>(function SlowList({ text }) {
  let items: JSX.Element[] = [];
  for (let i = 0; i < 250; i++) {
    items.push(<SlowItem key={i} text={text} />);
  }
  return <div className='items'>{items}</div>;
});

export default function AppDEemo() {
  const [text, setText] = useState('');
  const deferredText = useDeferredValue(text);
  React.useEffect(() => {
    console.log(deferredText, 'deferredText change');
  }, [deferredText]);
  return (
    <>
      <input value={text} onChange={(e) => setText(e.target.value)} />
      <SlowList text={deferredText} />
    </>
  );
}
