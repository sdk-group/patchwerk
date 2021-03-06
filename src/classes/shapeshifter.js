'use strict'

let BasicDocument = require('./basic.js');

let discover = function (model_name) {
	let name = _.kebabCase(model_name);
	return require(`./${name}.js`)
}

class Shapeshifter extends BasicDocument {
	static description() {
		return {};
	}

	pickData(dataset) {
		// console.log(dataset);
		let definition = dataset && dataset[this.id] && dataset[this.id].value && dataset[this.id].value['@type'];

		let Model = discover(definition);
		let obj = new Model(this.keymap);
		obj.setCreationParams(this.creation_params);

		return obj.pickData(dataset);
	}
}

module.exports = Shapeshifter;