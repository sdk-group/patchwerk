'use strict'

let BasicDocument = require('./basic.js');

class ActiveWorkstation extends BasicDocument {
	static description() {
		return {
			"key": "{counter}",
			"counter": "active-workstation-counter"
		};
	}
}

module.exports = ActiveWorkstation;
