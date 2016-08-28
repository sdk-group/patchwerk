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
		if (!_.isNumber(this.value))[];

		return _.range(this.value + 1)
	}
	inc(emitter) {
		let args = [this.id, 1, {
			initial: 0
		}];
		return emitter.addTask('database.counter', {
			args: args
		}).then(result => this.value = result.value)
	}
}

module.exports = AtomicCounter;
