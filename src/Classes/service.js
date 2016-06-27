'use strict'

let BasicDocument = require('./basic.js');

class Service extends BasicDocument {
	static description() {
		return {
			"key": "service-%department%-%counter%",
			"parent": "global-service",
			"counter": "service-counter"
		};
	}
	constructor(params) {

	}
}

module.exports = Service;
