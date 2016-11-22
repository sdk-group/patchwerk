'use strict'

const BasicDocument = require('./basic.js');

class Plan extends BasicDocument {
	static description() {
		return {
			"key": "{agent}-{department}-plan--{date}"
		};
	}
}

module.exports = Plan;