// import _ from 'lodash';
import add from './add';
// console.log(_.get); // import('lodash');

import('./sum').then((m) => {
  console.log(m.default(3, 2));
});

add(3, 3);

// const divs = document.querySelectorAll('div');
// console.log(divs);
// Array.from(divs).forEach((div) => (div.innerHTML = 'div'));
// const HMR = module.hot;
// HMR && HMR.accept && HMR.accept();
