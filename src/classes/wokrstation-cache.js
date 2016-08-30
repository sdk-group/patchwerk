'use strict'

let BasicDocument = require('./basic.js');

class WorkstationCache extends BasicDocument {
  static description() {
    return {
      "key": "cache_workstations_{department}"
    };
  }
}

module.exports = WorkstationCache;