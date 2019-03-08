'use strict';

import Auth from './auth';

export default class Resource {
  constructor(endpoint, attributes) {
    this.endpoint = endpoint;

    if (attributes) {
      Object.assign(this, attributes);
    }
  }

  all() {
    const $ = window.$;

    return $.ajax(
        {
          url: this.endpoint,
          method: 'GET',
          dataType: 'json',
        });
  }

  saveInstance(instance) {
    let url = this.endpoint;
    let method = 'POST';
    const $ = window.$;

    // create a clone of this object with only the source attributes
    const clone = Object.assign({}, instance);
    delete clone.endpoint;

    if (instance.id) {
      url = this.endpoint+'/'+instance.id;
      method = 'PUT';
      clone._method = 'patch';
    }

    // inject my user_id in case the model requires it
    if (typeof clone.user_id === 'undefined' && Auth.isUserAuthenticated()) {
      const user = Auth.getUser();
      clone.user_id = user.id;
    }

    return $.ajax(
        {
          url: url,
          method: method,
          headers: {
            'X-CSRF-TOKEN': window.csrf_token,
          },
          dataType: 'json',
          data: clone,
        });
  }

  destroyInstance(instance) {
    const url = this.endpoint+'/'+instance.id;
    const $ = window.$;

    return $.ajax(
        {
          url: url,
          method: 'DELETE',
          headers: {
            'X-CSRF-TOKEN': window.csrf_token,
          },
          dataType: 'json',
        });
  }

  get(id) {
    const url = this.endpoint+'/'+id;
    const $ = window.$;

    return $.ajax(
        {
          url: url,
          method: 'GET',
          dataType: 'json',
        });
  }

  query(data) {
    const $ = window.$;

    return $.ajax(
        {
          data: data,
          url: this.endpoint,
          method: 'GET',
          dataType: 'json',
        });
  }

  save() {
    return this.saveInstance(this);
  }

  destroy() {
    return this.destroyInstance(this);
  }
}
