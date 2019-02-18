
import Resource from './resource'
import ResourceStream from './resourceStream'
import {EventBus} from './eventBus'

class Store {
  constructor(state) {

    this.state = state || {}
    this.streams = {}
  }

  getState() {
    return this.state
  }

  isLoaded(klazz) {
    return (typeof this.state[klazz] !== 'undefined') && this.state[klazz].length > 0
  }

  loadResources(klazz, endpoint, done) {
    this.state[klazz] = []
    let vm = this

    new Resource(endpoint).all().then((resp) => {
      if (resp.data) {
        resp.data.forEach((entry) => {
          vm.state[klazz].push( new Resource(endpoint, entry))
        })
        done(vm.state[klazz])
      }
    }).catch((error) => {
      console.log('store load resources failed with', error)
      vm.handleErrors('Load', klazz, error.statusText, error.responseJSON)
    });
  }

  validationErrors(action, klazz, response) {

    let msgs = response.replace('Validation failed. [', '').split('Amber::Validators::Error')
    msgs.shift()

    let re = /\@message=.(Field [a-zA-Z0-9 _]+)/
    msgs.forEach((msg) => {
      msg.replace(re, (match, msg) => {
        window.toastr.error(msg)
        EventBus.emit(`validation:failed:${klazz}`, msg.replace('Field ',''))
      });
    })
  }

  handleErrors(action, klazz, statusText, response) {

    if (response.error && typeof response.error === 'string' && response.error.startsWith('Validation')) {
      window.toastr.error(`${action} ${klazz} ${statusText} - Validation failed`)
      return this.validationErrors(action, klazz, response.error)
    }

    if (response.error && typeof response.error === 'array') {
      window.toastr.error(`${action} ${klazz} ${statusText}`)
      // array of error messages
      msgs.forEach((msg) => {
        window.toastr.error(msg)
      })
    } else if (response.error && typeof response.error === 'string') {
      window.toastr.error(`${action} ${klazz} ${statusText}`)
      window.toastr.error(response.error)
    }
  }

  subscribe(klazz, endpoint, done) {
    let vm = this

    if (this.streams[klazz]) {
      done(this.state[klazz])
      return
    }

    this.state[klazz] = []

    // create a ResourceStream and subscribe to events
    let stream = new ResourceStream(klazz, endpoint)

    this.streams[klazz] = {
      stream: stream,
      page: 0,
      per_page: 50
    }

    stream.on('new:model', message => {
      console.log('new model', message.data);
      let model = JSON.parse(message.data);

      vm.state[klazz].push( new Resource(endpoint, model) );

      EventBus.emit('new:model:'+klazz, model);
    });

    stream.on('update:model', message => {
      console.log('update model', message.data);
      let model = JSON.parse(message.data);
      let old_model = this.find(klazz, model.id)

      if (old_model) {
        Object.assign(old_model, model);

        EventBus.emit('update:model:'+klazz, model);
      }

    });

    stream.on('delete:model', message => {
      console.log('delete model', message.data);
      let model = JSON.parse(message.data);

      vm.state[klazz] = vm.state[klazz].filter((item, j) => item.id !=  parseInt(model.id));

      EventBus.emit('delete:model:'+klazz, model);
    });

    // fetch and sort the index
    stream.all().then((data) => {
      if (data) {
        data.forEach((entry) => {
          vm.state[klazz].push( new Resource(endpoint, entry) );
        })
        EventBus.emit('loaded:models:'+klazz, vm.state[klazz]);
        done(vm.state[klazz])
      }
    }).catch((error) => {
      console.log('load error', error);
      vm.handleErrors('Load', klazz, error.statusText, error.responseJSON)
    });
  }

  find(klazz, id) {
    if (this.isLoaded(klazz)) {
      return this.getState()[klazz].find((item) => item.id == id)
    }
    return undefined
  }

  related(klazz, fieldname, value) {
    // find the records from klazz where fieldname == value
    if (this.isLoaded(klazz)) {
      return this.getState()[klazz].filter((item) => item[fieldname] == value)
    }
    return new Promise(function(resolve, reject) {
      reject({
        statusText: `Could not find related records`,
        responseJSON: {
          error: `Records for ${klazz} are not loaded`
        }
      });
    });
  }

  update(klazz, id, model) {
    if (this.isLoaded(klazz)) {
      let old_model = this.find(klazz, model.id)

      if (old_model) {
        Object.assign(old_model, model);

        return old_model.save();
      }
    }
    let msg = this.isLoaded(klazz) ? `Could not find record :${id}` : `Records for ${klazz} are not loaded`
    return new Promise(function(resolve, reject) {
      setTimeout(function() {
        reject({error: {
          statusText: `Could not update ID:${id}`,
          responseJSON: {
            error: msg
          }
        }});
      }, 300);
    });
  }

  delete(klazz, id) {
    let model
    let vm = this

    if (this.isLoaded(klazz)) {
      if (model = this.find(klazz, id)) {
        this.state[klazz] = this.state[klazz].filter((item, j) => item.id !=  parseInt(id));

        model.destroy().then(() => {
          EventBus.emit('delete:model:'+klazz, model);
        }).catch((error) => {
          vm.handleErrors("Delete", klazz, error.statusText, error.responseJSON)
        })
      }
    }
  }

}

export const store = new Store();
