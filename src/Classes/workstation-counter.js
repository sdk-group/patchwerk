'use strict'

let AtomicCounter = require('./atomic-counter.js');

class WorkstationCounter extends AtomicCounter {
  static description() {
    return {
      "key": "cache_workstations_{department}"
    }
  }
  range(query) {
    let available_workstations = _.get(this.value, ['content', 'control-panel']);

    if (query && query.state == 'active') {
      available_workstations = _.filter(available_workstations, ['active', true]);
    }

    return _.map(available_workstations, 'id');
  }
}

module.exports = WorkstationCounter;