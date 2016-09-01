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

		return _.chain(this.properties.content)
			.filter(item => item.organization == this.creation_parms.department)
			.map('@id').value();
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
