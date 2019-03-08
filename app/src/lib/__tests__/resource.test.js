import React from 'react'

import Resource from '../js/resource'
import jquery from 'jquery'

jest.mock('jquery')
const $ = jquery
window.$ = jquery
window.csrf_token = 'skdjhasdjhaksjdhaksjhdaksjh'
beforeEach(() => jest.resetModules())

it('calls $.ajax with the correct params', () => {
  const products = [{ id: 1, name: 'Widget' }]
  const resp = { data: products }

  $.ajax.mockImplementation(() => Promise.resolve(resp))

  let res = new Resource('/products')

  res.all().then(resp => expect(resp.data).toEqual(products))

  // Now make sure that $.ajax was properly called
  expect($.ajax).toBeCalledWith({
    method: 'GET',
    url: '/products',
    dataType: 'json'
  })
})

it('gets a record via $.ajax', () => {
  const product = { id: 1, name: 'Widget' }
  const resp = { data: product }

  $.ajax.mockImplementation(() => Promise.resolve(resp))

  let res = new Resource('/products')

  res.get(1).then(resp => expect(resp.data).toEqual(product))

  // Now make sure that $.ajax was properly called
  expect($.ajax).toBeCalledWith({
    method: 'GET',
    url: '/products/1',
    dataType: 'json'
  })
})

it('finds records with a value via $.ajax', () => {
  const product = { id: 1, name: 'Widget' }
  const resp = { data: product }

  $.ajax.mockImplementation(() => Promise.resolve(resp))

  let res = new Resource('/products')

  res.query({ field: 'id', value: 1 }).then(resp => expect(resp.data).toEqual(product))

  // Now make sure that $.ajax was properly called
  expect($.ajax).toBeCalledWith({
    data: { field: 'id', value: 1 },
    method: 'GET',
    url: '/products',
    dataType: 'json'
  })
})

it('creates a record via $.ajax', () => {
  const product = { name: 'Widget' }
  const resp = { data: product }

  $.ajax.mockImplementation(() => Promise.resolve(resp))

  let res = new Resource('/products', { name: 'Widget' })

  res.save().then(resp => expect(resp.data).toEqual(product))

  // Now make sure that $.ajax was properly called
  expect($.ajax).toBeCalledWith({
    data: product,
    method: 'POST',
    url: '/products',
    dataType: 'json',
    headers: {
      'X-CSRF-TOKEN': window.csrf_token
    }
  })
})

it('saves an existing record via $.ajax', () => {
  const product = { id: 1, name: 'Widget' }
  const resp = { data: product }

  jquery.ajax.mockImplementation(() => Promise.resolve(resp))

  let res = new Resource('/products', { id: 1, name: 'Widget' })

  res.save().then(resp => expect(resp.data).toEqual(product))

  // Now make sure that $.ajax was properly called
  expect($.ajax).toBeCalledWith({
    data: { ...product, _method: 'patch' },
    method: 'PUT',
    url: '/products/1',
    dataType: 'json',
    headers: {
      'X-CSRF-TOKEN': window.csrf_token
    }
  })
})

it('destroys an existing record via $.ajax', () => {
  const product = { id: 1, name: 'Widget' }
  const resp = { data: product }

  jquery.ajax.mockImplementation(() => Promise.resolve(resp))

  let res = new Resource('/products', { id: 1, name: 'Widget' })

  res.destroy().then(resp => expect(resp.data).toEqual(product))

  // Now make sure that $.ajax was properly called
  expect($.ajax).toBeCalledWith({
    method: 'DELETE',
    url: '/products/1',
    dataType: 'json',
    headers: {
      'X-CSRF-TOKEN': window.csrf_token
    }
  })
})
