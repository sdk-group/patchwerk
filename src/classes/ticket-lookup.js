'use strict'

let BasicDocument = require('./basic.js');


class TicketLookup extends BasicDocument {
	static description() {
		return {
			"key": "lookup-ticket-{code}"
		};
	}
}

module.exports = TicketLookup;