
import Resource from './resource';

class Store {
  constructor(state) {

    this.state = state || {};
  }

  getState() {
    return this.state;
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

  find(klazz, id) {
    if (this.isLoaded(klazz)) {
      return this.getState()[klazz].filter((item) => item.id == id)[0]
    }
    return undefined
  }

}

export const store = new Store();
