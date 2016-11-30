'use strict'

let Workstation = require('./workstation.js');

//meh
const schema = {
	"ticket_design": String,
	"attached_terminal": String,
	"occupied_by": Array,
	"default_agent": String,
	"attached_to": String,
	"device_sound": String,
	"device_design": String,
	"device_type": String,
	"digital_display_address": String,
	"device_placement": String,
	"state": String,
	"label": String,
	"short_label": String,
	"description": String
};

const schema_keys = Object.keys(schema);

class Reception extends Workstation {
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
		throw new Error("It is a terminal!");
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

module.exports = Reception;