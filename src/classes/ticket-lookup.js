'use strict'

let BasicDocument = require('./basic.js');


class TicketLookup extends BasicDocument {
	static description() {
		return {
			"key": "lookup_ticket_{code}"
		};
	}
}

module.exports = TicketLookup;
