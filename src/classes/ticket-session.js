'use strict'

let BasicDocument = require('./basic.js');


class TicketSession extends BasicDocument {
	static description() {
		return {
			"key": "ticket-session-{department}-{date}--{counter}",
			"counter": "ticket-session-counter"
		};
	}
	static fields() {
		return ["label", "description", "uses", "dedicated_date", "organization", "code", "user_info"];
	}

	getDescription() {
		return _.cloneDeep(this.properties.description);
	}

	fillThis(dataset) {
		let id = this.id;
		let data = dataset[id] || {};
		this.properties = data.value || {};
		this.properties = _.pick(this.properties, TicketSession.fields());
		this.properties['@type'] = this.type;

		return this;
	}
}

module.exports = TicketSession;