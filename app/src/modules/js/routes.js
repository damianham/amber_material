import React from 'react'
import {Home} from '../../views/home/js/home'

let routes = []

export default routes

routes.push({
  path: '/',
  exact: true,
  type: 'index',
  name: 'Home',
  main: Home,
  icon: 'Home'
})

// append routes
