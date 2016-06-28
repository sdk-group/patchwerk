'use strict'

let BasicDocument = require('./basic.js');

class GlobalService extends BasicDocument {
	static description() {
		return {
			"key": "service-{counter}",
			"counter": "service-counter"
		};
	}
}

module.exports = GlobalService;
