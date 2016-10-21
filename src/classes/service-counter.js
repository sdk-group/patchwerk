'use strict'

const _ = require('lodash');
const AtomicCounter = require('./atomic-counter.js');
const uuid = require("node-uuid");

class ServiceCounter extends AtomicCounter {
	static description() {
		return {
			"key": "registry_service_{department}"
		}
	}
	range() {
		if (!this.properties) return [];

		return _.map(this.properties.content, item => item.replace('service-', ''));
	}
	inc(emitter) {
		let id = uuid.v1()
			.replace(/-/g, "");

		this.properties.content.push('service-' + id);

		let data = this.getSource();

		return emitter.addTask('database.upsertNodes', {
				args: [data]
			})
			.then(data => id);
	}
	add(params, patchwerk) {
		//@NOTE: never use it without strong need
		//@NOTE: this method is fucking unsafe
		//@TODO: rework this ugly concept
		let id = params.id;

		this.properties.content.push(id);

		return patchwerk.save(this)
	}
}

module.exports = ServiceCounter;