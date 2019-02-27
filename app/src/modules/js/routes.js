import React from 'react';

var routes = [];

export default routes;

import { Home } from '../../views/home/js/home';

routes.push(  {
  path: "/",
  exact: true,
  type: 'index',
  name: 'Home',
  main: Home,
  icon: 'Home'
  });

// append routes
