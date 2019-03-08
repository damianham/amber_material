'use strict'

import Resource from './resource'
import ResourceStream from './resourceStream'
import { EventBus } from './eventBus'

class Store {
  constructor (state) {
    this.state = state || {}
    this.streams = {}
  }

  getState () {
    return this.state
  }

  isLoaded (klazz) {
    return (typeof this.state[klazz] !== 'undefined') && this.state[klazz].length > 0
  }

  loadResources (klazz, endpoint, done) {
    this.state[klazz] = []
    const vm = this

    new Resource(endpoint).all().done((resp) => {
      if (resp.data) {
        resp.data.forEach((entry) => {
          vm.state[klazz].push(new Resource(endpoint, entry))
        })
        done(vm.state[klazz])
      }
    }).fail((error, statusText) => {
      console.log('store load resources failed with', statusText)
      vm.handleErrors('Load', klazz, statusText, error)
    })
  }

  validationErrors (action, klazz, response) {
    const msgs = response.replace('Validation failed. [', '').split('Amber::Validators::Error')
    msgs.shift()

    const re = /@message=.(Field [a-zA-Z0-9 _]+)/
    msgs.forEach((msg) => {
      msg.replace(re, (match, msg) => {
        window.toastr.error(msg)
        EventBus.emit(`validation:failed:${klazz}`, msg.replace('Field ', ''))
      })
    })
  }

  handleErrors (action, klazz, statusText, response) {
    // response is possibly a jquery jqXHR
    // which has responseJSON
    if (response.error && typeof response.error === 'string' && response.error.startsWith('Validation')) {
      window.toastr.error(`${action} ${klazz} ${statusText} - Validation failed`)
      return this.validationErrors(action, klazz, response.error)
    }

    if (response.error && Array.isArray(response.error)) {
      window.toastr.error(`${action} ${klazz} ${statusText}`)
      // array of error messages
      response.error.forEach((msg) => {
        window.toastr.error(msg)
      })
    } else if (response.error && typeof response.error === 'string') {
      window.toastr.error(`${action} ${klazz} ${statusText}`)
      window.toastr.error(response.error)
    }
  }

  subscribe (klazz, endpoint, done) {
    const vm = this

    if (this.streams[klazz]) {
      done(this.state[klazz])
      return
    }

    this.state[klazz] = []

    // create a ResourceStream and subscribe to events
    const stream = new ResourceStream(klazz, endpoint)

    this.streams[klazz] = {
      stream: stream,
      page: 0,
      per_page: 50
    }

    stream.on('new:model', (message) => {
      // console.log('new model', message.data);
      const model = JSON.parse(message.data)

      vm.state[klazz].push(new Resource(endpoint, model))

      EventBus.emit('new:model:' + klazz, model)
    })

    stream.on('update:model', (message) => {
      // console.log('update model', message.data);
      const model = JSON.parse(message.data)
      const oldModel = this.find(klazz, model.id)

      if (oldModel) {
        Object.assign(oldModel, model)

        EventBus.emit('update:model:' + klazz, model)
      }
    })

    stream.on('delete:model', (message) => {
      // console.log('delete model', message.data);
      const model = JSON.parse(message.data)

      vm.state[klazz] = vm.state[klazz].filter((item, j) => item.id !== parseInt(model.id))

      EventBus.emit('delete:model:' + klazz, model)
    })

    // fetch all records for this model
    stream.all().done((data) => {
      if (data) {
        data.forEach((entry) => {
          vm.state[klazz].push(new Resource(endpoint, entry))
        })
        EventBus.emit('loaded:models:' + klazz, vm.state[klazz])
        done(vm.state[klazz])
      }
    }).fail((error, statusText) => {
      console.log('load error', error)
      vm.handleErrors('Load', klazz, statusText, error)
    })
  }

  find (klazz, id) {
    if (this.isLoaded(klazz)) {
      return this.getState()[klazz].find((item) => item.id === id)
    }
    return undefined
  }

  related (klazz, fieldname, value) {
    // find the records from klazz where fieldname == value
    if (this.isLoaded(klazz)) {
      return this.getState()[klazz].filter((item) => item[fieldname] === value)
    }
    return new Promise(function (resolve, reject) {
      reject(Error(`Could not find related records Records for ${klazz} are not loaded`))
    })
  }

  update (klazz, id, model) {
    if (this.isLoaded(klazz)) {
      const oldModel = this.find(klazz, model.id)

      if (oldModel) {
        Object.assign(oldModel, model)

        return oldModel.save()
      }
    }
    const msg = this.isLoaded(klazz) ? `Could not find record :${id}` : `Records for ${klazz} are not loaded`
    return new Promise(function (resolve, reject) {
      reject(Error(`Could not update ID:${id} ${msg}`))
    })
  }

  delete (klazz, id) {
    const vm = this

    if (this.isLoaded(klazz)) {
      const model = this.find(klazz, id)
      if (model) {
        this.state[klazz] = this.state[klazz].filter((item, j) => item.id !== parseInt(id))

        model.destroy().done(() => {
          EventBus.emit('delete:model:' + klazz, model)
        }).fail((error, statusText) => {
          vm.handleErrors('Delete', klazz, statusText, error)
        })
      }
    }
  }
}

export const store = new Store()
