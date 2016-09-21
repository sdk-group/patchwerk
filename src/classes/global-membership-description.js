'use strict'

const _ = require('lodash');

const AtomicCounter = require('./atomic-counter.js');

class GlobalMembershipDescription extends AtomicCounter {
	static description() {
		return {
			"key": "global_membership_description"
		};
	}
	range() {
		if (!this.properties) return [];
		let len = "human-".length;
		let department = this.creation_params.department || false;
		let is_array = department.constructor == Array;

		return _.chain(this.properties.content)
			.filter(item => is_array ? !!~department.indexOf(item.organization) : item.organization == department)
			.map('member')
			.map(item => item.slice(len, item.length))
			.value();
	}
	add(params, patchwerk) {
		//@NOTE: never use it without strong need
		//@NOTE: this method is fucking unsafe
		//@TODO: rework this ugly concept
		let id = params.id;
		let role = params.role || 'Operator';
		let organization = params.organization;

		this.properties.content.push({
			"@type": "Membership",
			"@id": "membership-" + this.properties.content.length,
			"member": id,
			"organization": organization,
			"role": role
		});

		return patchwerk.save(this)
	}
	inc() {
		throw new Error('not implemented');
	}
}

module.exports = GlobalMembershipDescription;
