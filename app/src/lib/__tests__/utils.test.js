import Resource from '../js/resource'
import jquery from 'jquery'

import Auth from '../js/auth'
import { bestTitleForClass, titleForId, optionsForClass, titlesForResource, canEditItem } from '../js/utils'

jest.mock('jquery')
const $ = jquery
window.$ = jquery
window.csrf_token = 'skdjhasdjhaksjdhaksjhdaksjh'
afterEach(() => jest.resetModules())

describe('bestTitleForClass', () => {
  it('gets the title for an object', () => {
    const obj = { title: 'Spangle Doozy',
      name: 'Spangle Doozy',
      username: 'spangledrops',
      email: 'spangledrops@doozywhoozy.com',
      id: 1001 }

    expect(bestTitleForClass(obj)).toEqual(obj.title)
  })

  it('gets the name for an object', () => {
    const obj = { name: 'Spangle Doozy',
      username: 'spangledrops',
      email: 'spangledrops@doozywhoozy.com',
      id: 1001 }

    expect(bestTitleForClass(obj)).toEqual(obj.name)
  })

  it('gets the username for an object', () => {
    const obj = { username: 'spangledrops',
      email: 'spangledrops@doozywhoozy.com',
      id: 1001 }

    expect(bestTitleForClass(obj)).toEqual(obj.username)
  })

  it('gets the email for an object', () => {
    const obj = { email: 'spangledrops@doozywhoozy.com', id: 1001 }

    expect(bestTitleForClass(obj)).toEqual(obj.email)
  })

  it('gets the ID for an object', () => {
    const obj = { somethingelse: 'dfjslkjsdlfjsldfjlskjdfl', id: 1001 }

    expect(bestTitleForClass(obj)).toEqual(obj.id)
  })
})

it('gets the title For Id', () => {
  const obj1 = { title: 'Spangle Doozy',
    name: 'Spangle Doozy',
    username: 'spangledrops',
    email: 'spangledrops@doozywhoozy.com',
    id: 1 }
  const obj2 = { name: 'Spangle Doozy',
    username: 'spangledrops',
    email: 'spangledrops@doozywhoozy.com',
    id: 2 }

  const store = {
    getState: () => {
      return {
        products: [obj1, obj2]
      }
    }
  }
  expect(titleForId(store, 1, 'products')).toEqual(obj1.title)
  expect(titleForId(store, 2, 'products')).toEqual(obj1.name)
})

it('gets the options For a Class', () => {
  const obj1 = { title: 'Spangle Doozy',
    name: 'Spangle Doozy',
    username: 'spangledrops',
    email: 'spangledrops@doozywhoozy.com',
    id: 1 }
  const obj2 = { name: 'Spangle Doozy',
    username: 'spangledrops',
    email: 'spangledrops@doozywhoozy.com',
    id: 2 }

  const store = {
    getState: () => {
      return {
        products: [obj1, obj2]
      }
    }
  }

  expect(optionsForClass(store, 'products')).toEqual([
    { value: obj1.id, label: obj1.title },
    { value: obj2.id, label: obj1.name }
  ])
})

describe('titlesForResource', () => {
  it('uses locally stored data', () => {
    const obj1 = { title: 'Spangle Doozy',
      name: 'Spangle Doozy',
      username: 'spangledrops',
      email: 'spangledrops@doozywhoozy.com',
      id: 1 }
    const obj2 = { name: 'Spangle Doozy',
      username: 'spangledrops',
      email: 'spangledrops@doozywhoozy.com',
      id: 2 }

    const data = {
      products: [obj1, obj2]
    }

    expect(titlesForResource(data, 'products')).toEqual([
      { value: obj1.id, label: obj1.title },
      { value: obj2.id, label: obj1.name }
    ])
  })

  it('uses resource via $.ajax', (done) => {
    const obj1 = { title: 'Spangle Doozy',
      name: 'Spangle Doozy',
      username: 'spangledrops',
      email: 'spangledrops@doozywhoozy.com',
      id: 1 }
    const obj2 = { name: 'Spangle Doozy',
      username: 'spangledrops',
      email: 'spangledrops@doozywhoozy.com',
      id: 2 }
    const endpoint = '/products'

    const products = [obj1, obj2]
    const resp = { data: products }

    $.ajax.mockImplementation(() => Promise.resolve(resp))

    const delegate = {
      [endpoint]: undefined,
      onLoaded: (url, resp) => {
        expect(url).toEqual(endpoint)
        expect(resp.data).toEqual(products)
        done()
      }
    }

    expect(titlesForResource(delegate, endpoint)).toEqual([])

    // Now make sure that $.ajax was properly called
    expect($.ajax).toBeCalledWith({
      method: 'GET',
      url: '/products',
      dataType: 'json'
    })
  })
})

describe('canEditItem', () => {
  beforeEach(() => Auth.deauthenticateUser())

  it('allows item for authenticated same owner', () => {
    let user = {
      id: 1,
      name: 'fake-name'
    }
    let obj = {
      id: 1,
      name: 'something',
      user_id: user.id
    }

    Auth.authenticateUser('my-dummy-token', user)

    expect(canEditItem(obj)).toBeTruthy()
  })

  it('allows item for admin role', () => {
    let user = {
      id: 1,
      name: 'fake-name',
      role: 'admin'
    }
    let obj = {
      id: 1,
      name: 'something',
      user_id: 20
    }

    Auth.authenticateUser('my-dummy-token', user)

    expect(canEditItem(obj)).toBeTruthy()
  })

  it('rejects item if not authenticated', () => {
    let obj = {
      id: 1,
      name: 'something',
      user_id: 20
    }

    expect(canEditItem(obj)).toBeFalsy()
  })

  it('rejects item for authenticated other owner', () => {
    let user = {
      id: 1,
      name: 'fake-name'
    }
    let obj = {
      id: 1,
      name: 'something',
      user_id: 20
    }

    Auth.authenticateUser('my-dummy-token', user)

    expect(canEditItem(obj)).toBeFalsy()
  })
})
