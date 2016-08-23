'use strict'

const _ = require('lodash');

const BasicDocument = require('./basic.js');

class AtomicCounter extends BasicDocument {
	constructor(id, datachain) {
		super(id, datachain);
		this.value = datachain[0].value;
	}
	range() {
		if (!_.isNumber(this.value)) throw new Error('Atomic counter value is not a number');

		return _.range(this.value + 1)
	}
}

module.exports = AtomicCounter;
