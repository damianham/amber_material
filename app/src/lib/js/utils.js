'use strict'

import Auth from './auth'
import Resource from './resource'

export const bestTitleForClass = function (item) {
  return item.title || item.name || item.username || item.email || item.id
}

export const titleForId = function (store, id, klazz) {
  if (typeof store.getState()[klazz] === 'undefined') return id
  const item = store.getState()[klazz].find((el) => { return el.id === id })
  return item ? bestTitleForClass(item) : id
}

export const optionsForClass = function (store, klazz) {
  if (typeof store.getState()[klazz] === 'undefined') return []
  return store.getState()[klazz].map((item) => {
    return { value: item.id, label: bestTitleForClass(item) }
  })
}

export const titlesForResource = function (delegate, endpoint) {
  if (typeof delegate[endpoint] !== 'undefined') {
    return delegate[endpoint].map((item) => {
      return { value: item.id, label: bestTitleForClass(item) }
    })
  }
  const res = new Resource(endpoint)

  res.all().then((resp) => {
    delegate.onLoaded(endpoint, resp)
  })

  return []
}

export const canEditItem = function (item) {
  if (Auth.isUserAuthenticated()) {
    const user = Auth.getUser()
    return user && (user.role === 'admin' || user.id === item.user_id)
  }
  return false
}
