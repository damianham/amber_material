
import jquery from 'jquery';

jest.mock('jquery');
window.$ = jquery;
window.csrf_token = 'skdjhasdjhaksjdhaksjhdaksjh';
beforeEach(() => jest.resetModules());

import Resource from '../js/resource';
import {store} from '../js/store'

it('gets undefined for a non existent record set', () => {
  expect(store.getState()['xyz']).toEqual(undefined)
})

it('returns false when a record set is not loaded', () => {
  expect(store.isLoaded('xyz')).toBeFalsy()
})

it('returns true when a record set is loaded', () => {
  const endpoint = '/products'
  const products = [new Resource(endpoint,{id:1, name: 'Widget'}),
                    new Resource(endpoint,{id: 2, name: 'Wimble'})];
  const resp = {data: products};

  jquery.ajax.mockImplementation(() => Promise.resolve(resp))

  store.loadResources('product', endpoint, (results) => {
    expect(store.isLoaded('product')).toBeTruthy()
  })
})

it('gets a list of records for a loaded record set', () => {
  const endpoint = '/products'
  const products = [new Resource(endpoint,{id:1, name: 'Widget'}),
                    new Resource(endpoint,{id: 2, name: 'Wimble'})];
  const resp = {data: products};

  jquery.ajax.mockImplementation(() => Promise.resolve(resp))

  store.loadResources('product', endpoint, (results) => {
    expect(results).toEqual(products)

    expect(store.getState()['product']).toEqual(products)
  })

  expect($.ajax).toBeCalledWith({
    method: 'GET',
    url: '/products',
    dataType: 'json'
  });
})

it('finds a record in a record set', () => {
  const endpoint = '/products'
  const products = [new Resource(endpoint,{id:1, name: 'Widget'}),
                    new Resource(endpoint,{id: 2, name: 'Wimble'})];
  const resp = {data: products};

  jquery.ajax.mockImplementation(() => Promise.resolve(resp))

  store.loadResources('product', endpoint, (results) => {
    expect(store.find('product', 1)).toEqual(products[0])
  })
})
