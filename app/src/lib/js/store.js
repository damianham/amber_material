
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
    });
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
      let old_model = vm.find(klazz, model.id)

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
    });
  }

  find(klazz, id) {
    if (this.isLoaded(klazz)) {
      return this.getState()[klazz].find((item) => item.id == id)
    }
    return undefined
  }

  delete(klazz, id) {
    let model

    if (this.isLoaded(klazz)) {
      if (model = this.find(klazz, id)) {
        this.state[klazz] = this.state[klazz].filter((item, j) => item.id !=  parseInt(id));

        model.destroy()
        console.log('emit delete model', klazz, id)
        EventBus.emit('delete:model:'+klazz, model);
      }
    }
  }

}

export const store = new Store();
