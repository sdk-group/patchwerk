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
	"hold_screen_design": String,
	"parent": String
};

const schema_keys = Object.keys(schema);

class Qa extends Workstation {
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
		throw new Error("It is a qa!");
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

module.exports = Qa;