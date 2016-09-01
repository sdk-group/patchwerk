'use strict'

let AtomicCounter = require('./atomic-counter.js');

class ScheduleCounter extends AtomicCounter {
	static description() {
		return {
			"key": "schedule-counter"
		}
	}
	constructor(id, datachain) {
		super(id, datachain);
		this.initial = 200;
	}
}

module.exports = ScheduleCounter;
