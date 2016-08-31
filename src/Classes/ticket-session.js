'use strict'

let BasicDocument = require('./basic.js');

class TicketSession extends BasicDocument {
	static description() {
		return {
			"key": "ticket-session-{department}-{date}--{counter}",
			"counter": "ticket-session-counter"
		};
	}
}

module.exports = TicketSession;