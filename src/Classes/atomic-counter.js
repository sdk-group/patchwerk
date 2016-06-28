'use strict'

let _ = require('lodash');

class AtomicCounter {
	constructor(id, data) {
		this.id = id;
		this.value = data.value;
	}
	range() {
		if (!_.isNumber(this.value)) throw new Error('Atomic counter value is not a number');

		return _.range(this.value + 1)
	}
}

module.exports = AtomicCounter;
