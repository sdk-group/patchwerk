'use strict'

let AtomicCounter = require('./atomic-counter.js');

class ActiveWorkstationCounter extends AtomicCounter {
	static description() {
		return {
			"key": "cache_workstations_{department}"
		}
	}
	range() {
		let ids = _.map(_.get(this.value, ['content', 'control-panel']), 'id')
		return ids;
	}
}

module.exports = ActiveWorkstationCounter;
