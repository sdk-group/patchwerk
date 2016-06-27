'use strict'

let _ = require('lodash');

let discover = function (model_name) {
	let name = _.kebabCase(model_name);
	return require(`./Classes/${name}.js`)
}

class Patchwerk {
	constructor(emitter) {
		this.emitter = emitter;
	}
	get(model_name, query) {
		let Model = discover(model_name);
		let is_colletction = this.isColletction(model_name, query);
		let Description = this.composeDescription(Model, query);
	}
	isColletction(model_name, query) {
		//@NOTE: temp
		let counter = query.counter;

		return query.counter == '*' || _.isArray(query.counter);
	}
	composeDescription(Model, query) {
		let description = Model.description();
		let chain = this.resolveParents(description, []);
		console.log(chain);
	}
	resolveParents(description, acc) {
		let parent = description.parent || false;

		if (parent) {
			acc.push(parent);

			let pm = discover(parent);
			this.resolveParents(pm.description(), acc);
		}
		return acc;
	}
}


module.exports = Patchwerk;
