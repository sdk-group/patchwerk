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

		return _.map(this.properties.content, item => {
			return item.replace('service-', '');
		});
	}
	inc(emitter) {
		let ids = this.properties.content;
		let last = _.last(this.properties.content);
		let id = 'service-' + (parseInt(last.split('-')[1]) + 1);

		this.properties.content.push(id);

		let data = this.getSource();

		return emitter.addTask('database.upsertNodes', {
			args: [data]
		});
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
