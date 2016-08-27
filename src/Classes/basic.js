'use strict'

let _ = require('lodash');

class BasicDocument {
	constructor(keymap, datachain) {
		this.id = keymap.ids[0];
		this.keymap = keymap;
		this.owners = {};
		if (datachain) this.processDatachain(datachain);
	}
	pickData(dataset) {
		let len = this.ids.length;
		let datachain = Array(len);
		console.log('ids', this.ids);


		while (len--) {
			let item = this.ids[len];
			datachain[len] = dataset[item].value;
		}

		this.processDatachain(datachain);
		console.log('dataset', datachain);

		return this;
	}
	processDatachain(datachain) {
		let composed = _.transform(datachain, (result, item) => {
			!!item && _.defaults(result, item.value);
		}, {});

		let key, value;

		for (key in composed) {
			value = composed[key];
			this[key] = value;
			this.owners[key] = this._ownerOf(key, datachain);
		}
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
