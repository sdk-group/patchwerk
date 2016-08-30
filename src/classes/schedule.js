'use strict'

const BasicDocument = require('./basic.js');

class Schedule extends BasicDocument {
	static description() {
		return {
			"key": "schedule-{counter}",
			"counter": "schedule-counter"
		};
	}
}

module.exports = Schedule;
