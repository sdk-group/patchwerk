'use strict'

const BasicDocument = require('./basic.js');
const _ = require('lodash');

class Employee extends BasicDocument {
	static description() {
		return {
			"key": "human-{counter}",
			"counter": "global-membership-description"
		};
	}
	attachService(services) {
		let provides = this.get('provides');

		this.set('provides', _.concat(services, provides))

		return this;
	}
}

module.exports = Employee;