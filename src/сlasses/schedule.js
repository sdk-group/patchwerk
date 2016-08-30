'use strict'

const BasicDocument = require('./basic.js');

class Schedule extends BasicDocument {
	static description() {
		return {
			"key": "schedule-{counter}",
			"counter": "schedule-counter"
		};
	}
	constructor(id, datachain) {
		super(id, datachain);
		this.initial = 200;
	}
}

module.exports = Schedule;
