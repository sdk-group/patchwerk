'use strict'

let AtomicCounter = require('./atomic-counter.js');

class WorkstationCounter extends AtomicCounter {
	static description() {
		return {
			"key": "registry_workstation_{department}"
		}
	}
	range() {
		let type = this.creation_params.type || 'control-panel';

		return type.constructor === Array ? _.flatMap(_.pick(this.properties, type)) : _.get(this.properties, ['content', type]);
	}
}

module.exports = WorkstationCounter;