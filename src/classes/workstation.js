'use strict'

let BasicDocument = require('./basic.js');

class Workstation extends BasicDocument {
  static description() {
    return {
      "key": "{counter}",
      "counter": "workstation-counter"
    };
  }
}

module.exports = Workstation;