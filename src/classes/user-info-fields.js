'use strict'

let BasicDocument = require('./basic.js');

class UserInfoFields extends BasicDocument {
	static description() {
		return {
			"key": "user_info_fields"
		};
	}
}

module.exports = UserInfoFields;