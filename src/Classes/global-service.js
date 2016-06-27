'use strict'

let BasicDocument = require('./basic.js');

class GlobalService extends BasicDocument {
	static description() {
		return {
			"key": "global-service-%department%-%counter%",
			"parent": "super",
			"counter": "service-counter"
		};
	}
	constructor(params) {

	}
}

module.exports = GlobalService;
