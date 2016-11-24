'use strict'

let Workstation = require('./workstation.js');

//meh
const schema = {
	"label": String,
	"short_label": String,
	"description": String,
	"default_agent": String,
	'attached_to': String,
	"device_type": String,
	"occupied_by": Array,
	"maintains": Array,
	"display_type": String,
	"symbol_depth": Number,
	"y_offset": Number,
	"x_offset": Number,
	"height": Number,
	"width": Number,
	"baud_rate": Number,
	"data_bits": Number,
	"parity": Number,
	"stop_bits": Number
};

const schema_keys = Object.keys(schema);

class DigitalDisplay extends Workstation {
	static description() {
		return {
			"key": "{counter}",
			"counter": "workstation-counter"
		};
	}

	static schema() {
		return schema;
	}

	static keys() {
		return schema_keys;
	}

	attachService(services) {
		throw new Error("It is a digital display!");
	}

	occupy(user) {
		let occupation = this.get("occupied_by") || [];
		occupation = _.castArray(occupation);
		this.set("occupied_by", _.uniq(_.concat(occupation, user)));
	}

	deoccupy(user) {
		let occupation = this.get("occupied_by") || [];
		this.set("occupied_by", _.uniq(_.filter(occupation, (usr) => usr && (usr !== user))));
	}

}

module.exports = DigitalDisplay;