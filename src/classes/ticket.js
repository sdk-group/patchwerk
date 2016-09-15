'use strict'

let BasicDocument = require('./basic.js');

const ticket_schema = {
	'label': String,
	'locked_fields': Object,
	'booking_method': String,
	'source': String,
	"qa_answers": Object,
	'time_description': Number,
	'operator': String,
	'alt_operator': Array,
	'history': Array,
	'service': String,
	"code": String,
	"destination": String,
	'org_destination': String,
	"booking_date": String,
	"dedicated_date": String,
	"priority": Object,
	"state": String,
	"user_info": Object,
	"service_count": Number,
	"called": Number,
	"expiry": Number
};

const transform_schema = {
	"registered=>called": true,
	"registered=>removed": true,
	"registered=>registered": true,
	"postponed=>called": true,
	"postponed=>registered": true,
	"booked=>registered": true,
	"booked=>removed": true,
	"booked=>expired": true,
	"called=>removed": true,
	"called=>registered": true,
	"called=>expired": true,
	"called=>processing": true,
	"called=>postponed": true,
	"processing=>closed": true,
	"processing=>postponed": true,
	"processing=>registered": true
};

let ticket_schema_keys = Object.keys(ticket_schema);

class Ticket extends BasicDocument {
	static description() {
		return {
			"key": "ticket-{department}-{date}--{counter}",
			"counter": "ticket-counter"
		};
	}

	static transform() {
		return transform_schema;
	}

	fillThis(dataset) {
		let l = ticket_schema_keys.length;
		let data = {};
		while (l--) {
			data[ticket_schema_keys[l]] = dataset[ticket_schema_keys[l]];
		}
		data.priority = data.priority || {};

		super.fillThis(data);
		this.priority_value = _.sum(_.map(this.properties.priority, 'value'));
		if (this.properties.dedicated_date && this.properties.dedicated_date.constructor !== String) {
			this.properties.dedicated_date = this.properties.dedicated_date.format('YYYY-MM-DD');
		}
		return this;
	}

	//precomputed and changeable
	priority() {
		return this.priority_value;
	}

	code() {
		return this.get('code');
	}

	state() {
		return this.get('state');
	}

	lockField(fieldname) {
		if (!!this.get(fieldname)) {
			let tmp = this.get('locked_fields') || {};
			tmp[fieldname] = this.get(fieldname);
			this.set('locked_fields', tmp);
		}
		return this;
	}

	modifyPriority(p_type, p_val) {
		if (!p_type || !p_val)
			return this;
		let curr = this.get('priority');
		curr[p_type] = {
			value: _.parseInt(p_val)
		};
		this.set(curr.priority);
		return this;
	}

	appendLabel(lbl) {
		this.set('label', this.get('label') + lbl);
	}

	//ticket-session orchestrator requirements
	setContainer(cnt) {
		this._container = cnt;
	}

	getContainer() {
		return this._container;
	}

	//like getSource, but contrdirected
	//@TODO this method should disappear later
	serialize() {
		let l = ticket_schema_keys.length;
		let res = {};
		while (l--) {
			res[ticket_schema_keys[l]] = this.properties[ticket_schema_keys[l]];
		}

		res.id = this.id;
		res.type = this.type;

		return res;
	}

	//state fns
	isActive() {
		return this.properties.state == 'called' || this.properties.state == 'processing';
	}

	isProcessed() {
		return this.properties.state != 'registered' &&
			this.properties.state != 'booked' &&
			this.properties.state != 'postponed';
	}

	canChangeState(from, to, operation) {
		if (operation == 'activate') {
			if (from == 'processing' || from == 'called' || from == 'postponed')
				return false;
		}
		let transform = this.constructor.transform();
		return !!transform[_.join([from, to], "=>")] && !transform[_.join(['*', to], "=>")];
	}

	changeState() {

	}

	//update
	update(data) {
		//@FIXIT make this less ugly
		let keys = Object.keys(data),
			l = keys.length,
			key;
		while (l--) {
			key = keys[l];
			this.set(key, data[key]);
		}
	}

}

module.exports = Ticket;