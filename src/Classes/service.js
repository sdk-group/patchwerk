'use strict'

let BasicDocument = require('./basic.js');
let GlobalService = require('./global-service.js');

class Service extends GlobalService {
  static description() {
    return {
      "key": "service-{department}-{counter}",
      "counter": "service-counter"
    };
  }
  constructor(params) {

  }
}

module.exports = Service;