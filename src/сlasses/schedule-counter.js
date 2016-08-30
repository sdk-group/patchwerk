'use strict'

let AtomicCounter = require('./atomic-counter.js');

class ScheduleCounter extends AtomicCounter {
	static description() {
		return {
			"key": "schedule-service"
		}
	}
}

module.exports = ScheduleCounter;
