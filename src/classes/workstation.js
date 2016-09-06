'use strict'

let BasicDocument = require('./basic.js');

class Workstation extends BasicDocument {
  static description() {
    return {
      "key": "{counter}",
      "counter": "workstation-counter"
    };
  }
  attachService(services) {
    let provides = this.get('provides');

    this.set('provides', _.concat(services, provides))

    return this;
  }

}

module.exports = Workstation;
