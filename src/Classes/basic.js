'use strict'

let _ = require('lodash');

class BasicDocument {
	constructor(id, datachain) {
		this.id = id;
		this.owners = {};
		this.processDatachain(datachain);
	}
	processDatachain(datachain) {
		let composed = _.transform(datachain, (result, item) => {
			_.defaults(result, item.value);
		}, {});

		_.forEach(composed, (value, key) => {
			this[key] = value;
			this.owners[key] = this._ownerOf(key, datachain);
		})
	}

	_ownerOf(param_name, datachain) {
		let owner = false;
		_.forEach(datachain, (d, index) => {
			if (!_.has(d, ['value', param_name])) return true;
			owner = d.value['@id'];
			return false;
		});
		return owner;
	}
}

module.exports = BasicDocument;
