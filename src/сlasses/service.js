'use strict'

let GlobalService = require('./global-service.js');

class Service extends GlobalService {
	static description() {
		return {
			"key": "service-{department}-{counter}",
			"counter": "service-counter"
		};
	}
}

module.exports = Service;
