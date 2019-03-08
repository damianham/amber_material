import React from 'react'
import {HashRouter} from 'react-router-dom'
import App from '../app'

import renderer from 'react-test-renderer'

it('renders the App', () => {
  const component = renderer.create(<HashRouter>
    <App />
  </HashRouter>)

  const tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})
