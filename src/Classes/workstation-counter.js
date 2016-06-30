'use strict'

let AtomicCounter = require('./atomic-counter.js');

class WorkstationCounter extends AtomicCounter {
  static description() {
    return {
      "key": "cache_workstations_{department}"
    }
  }
  range(query) {
    if (query && query.state == 'active') {
      return _.filter(_.get(this.value, ['content', 'control-panel']), ['active', true]);
    }

    return _.map(_.get(this.value, ['content', 'control-panel']), 'id');
  }
}

module.exports = WorkstationCounter;