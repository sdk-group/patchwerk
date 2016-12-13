'use strict'

let BasicDocument = require('./basic.js');

//meh
const schema = {
	"attached_terminal": String,
	"occupied_by": Array,
	"provides": Array,
	"has_schedule": Object,
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

class Workstation extends BasicDocument {
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

	// fillThis(dataset) {
	//  let keys = this.constructor.keys(),
	//    l = keys.length,
	//    tmp;
	//  let n_dataset = {};
	//  if (dataset[this.id].value) {
	//    let data = {};
	//    while (l--) {
	//      tmp = dataset[this.id].value[keys[l]];
	//      data[keys[l]] = tmp === undefined ? null : tmp;
	//    }
	//    data.occupied_by = data.occupied_by || [];
	//    n_dataset[this.id] = {
	//      value: data
	//    };

	//  }
	//  super.fillThis(n_dataset);
	//  return this;
	// }


	attachService(services) {
		let provides = this.get('provides');

		this.set('provides', _.concat(services, provides))

		return this;
	}

	//like getSource, but contrdirected
	//@TODO this method should disappear later
	serialize() {
		let keys = this.constructor.keys(),
			l = keys.length;
		let res = {};
		while (l--) {
			res[keys[l]] = this.properties[keys[l]];
		}

		res.id = this.id;
		res.type = this.type;

		return res;
	}

	occupiedBy(user) {
		let occupation = this.get("occupied_by") || [];
		return !!~_.indexOf(occupation, user);
	}

	occupy(user) {
		let occupation = this.get("occupied_by") || [];
		occupation = _.castArray(occupation);
		if (this.get("device_type") == 'control-panel') {
			if (!_.isEmpty(occupation) && !~_.indexOf(occupation, user))
				throw new Error(`Workstation ${this.id} is already occupied by agents ${occupation}.`);
		}
		this.set("occupied_by", _.uniq(_.concat(occupation, user)));
		this.getActive();
	}

	deoccupy(user) {
		let occupation = this.get("occupied_by") || [];
		this.set("occupied_by", _.uniq(_.filter(occupation, (usr) => usr && (usr !== user))));
		if (_.isEmpty(this.get("occupied_by")))
			this.getInactive();
	}

	clear() {
		this.set("occupied_by", []);
		this.getInactive();
	}

	getActive() {
		this.set("state", "active");
	}

	getInactive() {
		this.set("state", "inactive");
	}

	getPaused() {
		this.set("state", "paused");
	}

	is(state) {
		return this.get("state") == state;
	}
}

module.exports = Workstation;