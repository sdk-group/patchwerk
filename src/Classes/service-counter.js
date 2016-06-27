'use strict'

let AtomicCounter = require('./atomic-counter.js');

class ServiceCounter extends AtomicCounter {
  static description() {
    return {
      "key": "service-counter-%department%"
    }
  }
  constructor() {

  }
}

module.exports = ServiceCounter;