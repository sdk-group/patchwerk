'use strict'

const BasicDocument = require('./basic.js');
const _ = require('lodash');

class Department extends BasicDocument {
	static description() {
		return {
			"key": "global_org_structure"
		};
	}
	fillThis(dataset) {
		//@FIXIT: rework this!
		this.id = this.creation_params.department;
		let id = this.id;
		let data = dataset["global_org_structure"] || {};
		let content = _.get(data, ["value", "content"]) || [];
		this.properties = _.find(content, ["@id", id]) || {};
		this.properties['@type'] = this.type;

		_.forEach(this.properties, (property, name) => {
			this[name] = property
		});

		return this;
	}
}

module.exports = Department;
