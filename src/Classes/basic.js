'use strict'

let _ = require('lodash');

class BasicDocument {
	constructor(ids, datachain) {
		this.id = ids[0];
		this.ids = ids;
		this.owners = {};
		if (datachain) this.processDatachain(datachain);
	}
	setData(dataset) {
		let len = this.ids.length;
		let datachain = Array(len);

		while (len--) {
			let item = this.ids[len];
			datachain[len] = dataset[item];
		}

		this.processDatachain(datachain);
	}
	processDatachain(datachain) {
		let composed = _.transform(datachain, (result, item) => {
			!!item && _.defaults(result, item.value);
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
