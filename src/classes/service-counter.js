'use strict'

const _ = require('lodash');
const AtomicCounter = require('./atomic-counter.js');

class ServiceCounter extends AtomicCounter {
	static description() {
		return {
			"key": "registry_service"
		}
	}
	range() {
		if (!this.properties) return [];

		return this.properties.content;
	}
	inc(emitter) {
		let ids = this.properties.content;
		let last = _.last(this.properties.content);
		let id = 'service-' + (pasreInt(last.split('-')[1]) + 1);

		this.properties.content.push(id);

		let data = this.getSourceData();

		return emitter.addTask('database.upsertNodes', {
			args: [data]
		});
	}
}

module.exports = ServiceCounter;
