import ReactDomClient from 'react-dom/client';
import App from './app';

ReactDomClient.createRoot(document.getElementById('container')!).render(
  <App />
);
