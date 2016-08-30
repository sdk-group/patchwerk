'use strict'

const BasicDocument = require('./basic.js');

class Operator extends BasicDocument {
	static description() {
		return {
			"key": "human-{counter}",
			"counter": "global-membership-description"
		};
	}
}

module.exports = Operator;
