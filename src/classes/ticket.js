'use strict'

let BasicDocument = require('./basic.js');

class Ticket extends BasicDocument {
	static description() {
		return {
			"key": "ticket-{department}-{date}--{counter}",
			"counter": "ticket-counter"
		};
	}

	static fields() {
		return ['label', "short_label", "description", 'locked_fields', 'booking_method', 'source', "qa_answers", 'time_description', 'operator', 'alt_operator', 'history', 'service', "code", "destination", 'org_destination', "booking_date", "dedicated_date", "priority", "state", "user_info", "service_count", "called", "expiry"];
	}

	fillThis(dataset) {
		super.fillThis(dataset);
		this.priority_value = _.sum(_.map(this.properties.priority, 'value'));
		if (this.properties.dedicated_date && this.properties.dedicated_date.constructor !== String) {
			this.properties.dedicated_date = this.properties.dedicated_date.format('YYYY-MM-DD');
		}
		return this;
	}

	priority() {
		return this.priority_value;
	}

	code() {
		return this.properties.code;
	}

	setContainer(cnt) {
		this._container = cnt;
	}

	getContainer() {
		return this._container;
	}

	serialize() {
		let fs = Ticket.fields();
		let res = _.pick(this.properties, fs);
		res.id = this.id;
		res.type = this.type;

		return res;
	}

	isActive() {
		return this.properties.state == 'called' || this.properties.state == 'processing';
	}

	update(data) {
		//@FIXIT make this less ugly
		let dataset = {};
		dataset[this.id] = {
			value: data
		};
		this.fillThis(dataset);
	}

	isProcessed() {
		return this.properties.state != 'registered' &&
			this.properties.state != 'booked' &&
			this.properties.state != 'postponed';
	}
}

module.exports = Ticket;