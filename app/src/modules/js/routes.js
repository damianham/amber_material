import React from 'react';

var routes = [];

export default routes;

import { Home, HomeSidebar} from '../../views/home/js/home';

routes.push(  {
  path: "/",
  exact: true,
  type: 'index',
  name: 'Home',
  sidebar: HomeSidebar,
  main: Home
  });

// append routes
