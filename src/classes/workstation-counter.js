'use strict'

let AtomicCounter = require('./atomic-counter.js');

class WorkstationCounter extends AtomicCounter {
	static description() {
		return {
			"key": "cache_workstations_{department}"
		}
	}
	range() {
		let query = this.creation_params;
		let type = this.creation_params.type || 'control-panel';

		let available_workstations;
		if (type.constructor == Array) {
			available_workstations = _.reduce(type, (acc, single) => {
				let items = _.get(this.properties, ['content', single]);
				return _.concat(acc, items);
			}, []);
		} else {
			available_workstations = _.get(this.properties, ['content', type]);
		}



		if (query && query.state == 'active') {
			available_workstations = _.filter(available_workstations, ws => ws.state == 'active');
		}

		return _.map(available_workstations, 'id');
	}
}

module.exports = WorkstationCounter;
