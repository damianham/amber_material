import React from 'react'

import Auth from '../js/auth'

it('saves authentication data', () => {
  const user = {
    id: 1,
    name: 'fake-name'
  }
  Auth.authenticateUser('my-dummy-token', user)

  expect(Auth.isUserAuthenticated()).toBeTruthy()
})

it('removes authentication data', () => {
  const user = {
    id: 1,
    name: 'fake-name'
  }
  Auth.authenticateUser('my-dummy-token', user)

  expect(Auth.isUserAuthenticated()).toBeTruthy()

  Auth.deauthenticateUser()

  expect(Auth.isUserAuthenticated()).toBeFalsy()
})

it('gets the token', () => {
  const user = {
    id: 1,
    name: 'fake-name'
  }
  Auth.authenticateUser('my-dummy-token', user)

  expect(Auth.getToken()).toEqual('my-dummy-token')
})

it('gets the user', () => {
  const user = {
    id: 1,
    name: 'fake-name'
  }
  Auth.authenticateUser('my-dummy-token', user)

  expect(Auth.getUser()).toEqual(user)
})

it('removes the token', () => {
  const user = {
    id: 1,
    name: 'fake-name'
  }
  Auth.authenticateUser('my-dummy-token', user)

  Auth.deauthenticateUser()

  expect(Auth.getToken()).toEqual(null)
})

it('removes the user', () => {
  const user = {
    id: 1,
    name: 'fake-name'
  }
  Auth.authenticateUser('my-dummy-token', user)

  Auth.deauthenticateUser()

  expect(Auth.getUser()).toEqual({})
})
