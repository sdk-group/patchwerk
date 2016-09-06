'use strict'

let BasicDocument = require('./basic.js');

class Service extends BasicDocument {
  static description() {
    return {
      "key": "example-{first_param}-{second_param}-{counter}",
      "counter": "example-counter"
    };
  }
}

module.exports = Service;
