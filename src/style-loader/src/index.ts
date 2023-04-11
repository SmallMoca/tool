import './style.less';

console.log('style module test');

(() => {
  const home = document.createElement('div');
  home.innerHTML = 'home';
  home.classList.add('home');
  document.body.append(home);
})();

declare const module: any;
const HMR = (module as any).hot;
HMR && HMR.accept && HMR.accept();
