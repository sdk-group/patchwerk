'use strict'

const _ = require('lodash');

module.exports = {
	resolveParents: function (Model) {
		let acc = [Model];
		let current = Model
		let parent = Object.getPrototypeOf(current) || false;

		while (parent) {
			if (_.isFunction(parent.description)) {
				acc.push(parent);
				current = parent;
				let parent = Object.getPrototypeOf(current) || false;
				continue;
			}

			parent = false;
		}

		return acc;
	}
};
