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
	inc(emitter) {
		return super.inc(emitter).then(res => {
			console.log(res);
			return res;
		})
	}
}

module.exports = ScheduleCounter;
