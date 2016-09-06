'use strict'

let AtomicCounter = require('./atomic-counter.js');


class TicketSessionCounter extends AtomicCounter {
	static description() {
		return {
			"key": "counter-ticket-session-{department}-{date}"
		}
	}
}

module.exports = TicketSessionCounter;