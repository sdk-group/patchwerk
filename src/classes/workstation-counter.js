'use strict'

let AtomicCounter = require('./atomic-counter.js');

class WorkstationCounter extends AtomicCounter {
	static description() {
		return {
			"key": "registry_workstation_{department}"
		}
	}
	range() {
		if (this.properties == null) return [];

		let type = this.creation_params.type || 'control-panel';

		return type.constructor === Array ? _.flatMap(_.pick(this.properties.content, type)) : _.get(this.properties, ['content', type]);
	}
}

module.exports = WorkstationCounter;