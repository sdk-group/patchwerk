'use strict'

let AtomicCounter = require('./atomic-counter.js');

class TicketCounter extends AtomicCounter {
	static description() {
		return {
			"key": "counter-ticket-{department}-{date}"
		}
	}
}

module.exports = TicketCounter;