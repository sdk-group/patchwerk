'use strict'

let BasicDocument = require('./basic.js');


class TicketSessionLookup extends BasicDocument {
	static description() {
		return {
			"key": "lookup-ticket-session-{code}"
		};
	}
}

module.exports = TicketSessionLookup;