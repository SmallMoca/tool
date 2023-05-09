import S from './app.module.less';
import ClockIn from './components/clock-in/clock-in';

export default function App() {
  return (
    <div className={S.home}>
      <ClockIn />
    </div>
  );
}
