import React from 'react';
import { useRoutes, Link, Navigate, BrowserRouter } from 'react-router-dom';
import './app.less';

const context = require.context('./pages', true, /index\.tsx$/);
context.keys().forEach((k) => console.log(k));
interface RouteConfig {
  path: string;
  notShowMenu?: boolean;
  component:
    | React.LazyExoticComponent<React.ComponentType>
    | React.ComponentType;
}
const routes: RouteConfig[] = context.keys().map((k) => {
  const moduleName = k.split('/')[1];
  const regex = /^\.\/(.*)/;
  const result = k.replace(regex, '$1');
  return {
    path: `${moduleName}`,
    component: React.lazy(() => import(`./pages/${result}`)),
  };
});

const home = routes[0].path;
// console.log(routes);
routes.unshift({
  path: `/`,
  notShowMenu: true,
  component: () => {
    return <Navigate to={home} />;
  },
});

function Routes() {
  const element = useRoutes(
    routes.map((route) => ({
      path: route.path,
      element: (
        <React.Suspense fallback={'loading...'}>
          <route.component></route.component>
        </React.Suspense>
      ),
    }))
  );

  return (
    <>
      <menu className='menu'>
        {routes
          .filter((i) => i.notShowMenu !== true)
          .map((item) => (
            <Link key={item.path} to={item.path}>
              {item.path}
            </Link>
          ))}
      </menu>
      <div className='content'>{element}</div>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes />
    </BrowserRouter>
  );
}
