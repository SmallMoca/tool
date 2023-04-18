import React from 'react';
export default function Todo() {
  const [count, setCount] = React.useState(0);
  return <button onClick={() => setCount((p) => p + 1)}>{count}</button>;
}
