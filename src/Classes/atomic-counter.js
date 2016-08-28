'use strict'

const _ = require('lodash');

const BasicDocument = require('./basic.js');

class AtomicCounter extends BasicDocument {
	constructor(id, datachain) {
		super(id, datachain);
	}
	pickData(dataset) {
		this.value = dataset[this.id].value;

		return this;
	}
	range() {
		if (!_.isNumber(this.value)) throw new Error('Atomic counter value is not a number');

		return _.range(this.value + 1)
	}
	inc(emitter) {
		return emitter.addTask('database.inc', {
			args: [this.id]
		}).then(result => this.value = result.value)
	}
}

module.exports = AtomicCounter;
