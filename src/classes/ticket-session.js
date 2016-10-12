'use strict'

let BasicDocument = require('./basic.js');

const schema = {
	"label": String,
	'description': String,
	'uses': Array,
	"code": String,
	"destination": String,
	'organization': String,
	"directed": Boolean,
	"dedicated_date": String,
	"user_info": Object
};

const schema_keys = Object.keys(schema);

class TicketSession extends BasicDocument {
	static description() {
		return {
			"key": "ticket-session-{department}-{date}--{counter}",
			"counter": "ticket-session-counter"
		};
	}

	getDescription() {
		return _.cloneDeep(this.properties.description);
	}

	fillThis(dataset) {
		let l = schema_keys.length,
			tmp;
		let n_dataset = {};
		if (dataset[this.id].value) {
			let data = {};
			while (l--) {
				tmp = dataset[this.id].value[schema_keys[l]];
				data[schema_keys[l]] = tmp === undefined ? null : tmp;
			}
			n_dataset[this.id] = {
				value: data
			};
		}
		super.fillThis(n_dataset);
		return this;
	}
}

module.exports = TicketSession;