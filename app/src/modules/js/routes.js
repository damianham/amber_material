import React from 'react';

var routes = [];

export default routes;

import Home from '../../views/home/js/home';

routes.push(  {
    path: "/",
    exact: true,
    type: 'index',
    name: 'Home',
    sidebar: () => <div>Home!</div>,
    main: Home
  });

// append routes
