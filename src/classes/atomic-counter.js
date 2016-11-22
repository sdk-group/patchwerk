'use strict'

const _ = require('lodash');

const BasicDocument = require('./basic.js');

class AtomicCounter extends BasicDocument {
	constructor(id, datachain) {
		super(id, datachain);
	}
	pickData(dataset) {
		this.properties = dataset[this.id] && dataset[this.id].value || null;

		return this;
	}
	range() {
		if (!_.isNumber(this.properties)) return [];

		return _.range(this.properties + 1)
	}
	inc(emitter) {
		let args = [this.id, 1, {
			initial: this.initial || 0
		}];
		return emitter.addTask('database.counter', {
				args: args
			})
			.then(result => this.properties = result.value)
	}
	getSource() {
		return this.properties;
	}
}

module.exports = AtomicCounter;