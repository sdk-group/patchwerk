'use strict'

let BasicDocument = require('./basic.js');

const ticket_schema = {
	"pack_member": Boolean,
	"inheritance_counter": Number,
	"inheritance_level": Number,
	"inherits": String,
	'label': String,
	'session': String,
	'locked_fields': Object,
	'booking_method': String,
	'source': String,
	"qa_answers": Object,
	'time_description': Number,
	'initial_time_description': Number,
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
	"user_info_description": Object,
	"service_count": Number,
	"called": Number,
	"expiry": Number
};

let ticket_schema_keys = Object.keys(ticket_schema);

class Ticket extends BasicDocument {
	static description() {
		return {
			"key": "ticket-{department}-{date}--{counter}",
			"counter": "ticket-counter"
		};
	}


	fillThis(dataset) {
		let l = ticket_schema_keys.length,
			tmp;
		let n_dataset = {};
		if (dataset[this.id].value) {
			let data = {};
			while (l--) {
				tmp = dataset[this.id].value[ticket_schema_keys[l]];
				data[ticket_schema_keys[l]] = tmp === undefined ? null : tmp;
			}
			data.priority = data.priority || {};
			data.locked_fields = data.locked_fields || {};
			n_dataset[this.id] = {
				value: data
			};

		}
		super.fillThis(n_dataset);
		this._recountPriority();
		if (this.properties.dedicated_date && this.properties.dedicated_date.constructor !== String) {
			this.set("dedicated_date", this.properties.dedicated_date.format('YYYY-MM-DD'));
		}
		return this;
	}

	//precomputed and changeable
	_recountPriority() {
		let prior = this.get("priority");
		this.priority_value = _.sum(_.map(prior, 'value'));
	}

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

	unlockField(fieldname) {
		if (!!this.get(fieldname)) {
			let tmp = this.get('locked_fields') || {};
			tmp[fieldname] = null;
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
		this.set('priority', curr);
		this._recountPriority();
		return this;
	}

	modifyLabel(lbl, method = 'append') {
		let new_label = this.get('label');
		(method == "append") && (new_label = new_label + (lbl || ""));
		(method == "prepend") && (new_label = (lbl || "") + new_label);
		this.set('label', new_label);
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
		// console.log("SERIALIZING");
		let l = ticket_schema_keys.length;
		let res = {};
		while (l--) {
			res[ticket_schema_keys[l]] = _.cloneDeep(this.properties[ticket_schema_keys[l]]);
		}

		res.id = this.id;
		res.type = this.type;

		return res;
	}

	//state fns
	isActive() {
		let state = this.get("state");
		return state == 'called' || state == 'processing';
	}

	isProcessed() {
		let state = this.get("state");
		return state != 'registered' &&
			state != 'booked' &&
			state != 'postponed';
	}

	isInactive() {
		let state = this.get("state");
		return state == 'closed' || state == 'expired' || state == 'removed';
	}

	//update
	update(data) {
		//@FIXIT make this less ugly
		let keys = Object.keys(data),
			l = keys.length,
			key;
		while (l--) {
			key = keys[l];
			if (ticket_schema[key] && data[key] != this.get(key))
				this.set(key, data[key]);
		}
		this._recountPriority();
	}

	appendHistory(entry) {
		let hst = this.get("history") || [];
		hst.push(entry);
		this.set("history", hst)
		return this;
	}
	restoreTimeDescription() {
		let td = this.get("initial_time_description");
		td = (td.constructor == Array) ? td.slice() : td;
		this.set("time_description", td);
	}

	setLastOperation(op) {
		this.last_operation = op;
	}
	getLastOperation() {
		return this.last_operation;
	}
	checkOperationInterference(op) {
		let lastop = this.getLastOperation();
		if (!lastop || !lastop.start || !lastop.end)
			return false;
		if (!op || !op.start || !op.end)
			return false;
		return (lastop.start <= op.start && lastop.end >= op.start && lastop.end <= op.end);
	}
}

module.exports = Ticket;