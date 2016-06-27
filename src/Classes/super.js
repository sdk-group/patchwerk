'use strict'

let BasicDocument = require('./basic.js');

class Super extends BasicDocument {
	static description() {
		return {
			"key": "global-service-%department%-%counter%",
			"counter": "service-counter"
		};
	}
	constructor(params) {

	}
}

module.exports = Super;
