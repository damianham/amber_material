import React from 'react';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import HomeIcon from '@material-ui/icons/Home';

var routes = [];

export default routes;

import { Home } from '../../views/home/js/home';

routes.push(  {
  path: "/",
  exact: true,
  type: 'index',
  name: 'Home',
  main: Home,
  icon: <HomeIcon />
  });

// append routes
