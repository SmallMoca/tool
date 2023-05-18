// import S from './app.module.less';
import { debounce } from 'lodash-es';
import { msg } from 'virtual:my-module';
// import ClockIn from './components/clock-in/clock-in';
// const

console.log(msg);

const onChange = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
  console.log(e.target.value);
}, 500);
export default function App() {
  return (
    <div>
      <input onChange={onChange} placeholder='input' type='text' />
    </div>
  );
}
