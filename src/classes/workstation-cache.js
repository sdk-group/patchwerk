'use strict'

let BasicDocument = require('./basic.js');

class WorkstationCache extends BasicDocument {
	static description() {
		return {
			"key": "registry_workstation_{department}"
		};
	}
}

module.exports = WorkstationCache;