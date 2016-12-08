'use strict'

let BasicDocument = require('./basic.js');

class UserInfoFields extends BasicDocument {
	static description() {
		return {
			"key": "user_info_fields"
		};
	}

	requiredValidation() {
		let content = this.get("content");
		let validators = {};
		let keys = Object.keys(content),
			l = keys.length;
		for (var j = 0; j < l; j++) {
			if (content[keys[j]].validator)
				validators[keys[j]] = content[keys[j]].validator || [];
		}
		return validators;
	}
}

module.exports = UserInfoFields;