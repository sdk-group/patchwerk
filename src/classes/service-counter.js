'use strict'

let AtomicCounter = require('./atomic-counter.js');

class ServiceCounter extends AtomicCounter {
	static description() {
		return {
			"key": "counter-service"
		}
	}
}

module.exports = ServiceCounter;
