'use strict'

let BasicDocument = require('./basic.js');

class OrganizationStructure extends BasicDocument {
	static description() {
		return {
			"key": "global_org_structure"
		};
	}
	getOffices(tier) {

	}
}

module.exports = OrganizationStructure;
