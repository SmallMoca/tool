import logo from '../assets/logo.png';
import resultJson from '../assets/result.json';
import './app.less';
import List from './components/list';

console.log(resultJson);

export default function App() {
  return (
    <div className='app'>
      <List />
      <img src={logo} alt='' />
    </div>
  );
}
