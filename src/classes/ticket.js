'use strict'

let BasicDocument = require('./basic.js');

class Ticket extends BasicDocument {
	static description() {
		return {
			"key": "ticket-{department}-{date}--{counter}",
			"counter": "ticket-counter"
		};
	}
}

module.exports = Ticket;
