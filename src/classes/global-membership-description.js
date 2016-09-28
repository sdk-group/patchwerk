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
		let department = this.creation_params && this.creation_params.department || false;

		let chain = _.chain(this.properties.content)

		if (department) chain = chain.filter(item => item.organization == department);

		chain = chain.map('member')
			.map(item => item.slice(len, item.length));

		return chain.value();
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
