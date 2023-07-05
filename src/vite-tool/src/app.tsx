// import S from './app.module.less';
import { debounce } from 'lodash-es';
import { msg } from 'virtual:my-module';
import ClockIn from 'comps/clock-in/clock-in';
import { cache } from 'react';
console.log(cache, 'cache');

console.log(msg);

const onChange = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
  console.log(e.target.value);
}, 100);
export default function App() {
  console.log('app render!!');

  return (
    <div>
      <ClockIn />
      <input onChange={onChange} placeholder='input' type='text' />

      <button
        onClick={(e) => {
          e.persist();
          console.log(e.target);
          new Promise((r) => {
            setTimeout(() => {
              r(true);
            }, 2000);
          }).then(() => {
            console.log(e.target);
          });
        }}
      >
        dddd
      </button>
    </div>
  );
}
