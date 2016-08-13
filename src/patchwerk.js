'use strict'

const _ = require('lodash');
const Templatizer = require('./utils/templatizer.js');
const resolveParents = require('./utils/parents.js').resolveParents;

let discover = function (model_name) {
	let name = _.kebabCase(model_name);
	return require(`./Classes/${name}.js`)
}

class Patchwerk {
	constructor(emitter) {
		this.emitter = emitter;
	}
	getModel(definition) {
		return _.isString(definition) ? discover(definition) : definition
	}
	get(model_def, query, options) {
		let Model = this.getModel(model_def);
		let Composer = this.composeDescription.bind(this, Model);

		return this.processQuery(Model, query)
			.then(Composer)
			.then(keyset => {
				let uniq_subset = _.uniq(_.flatten(keyset));
				return this.emitter.addTask('database.getMulti', {
						args: [uniq_subset]
					})
					.then((data) => {
						let composed = _.map(keyset, keys => {
							let datachain = _.map(keys, key => data[key]);
							let id = _.head(keys);

							return new Model(id, datachain);
						});

						return Model.isCollection(query) ? composed : _.head(composed);
					});
			});
	}

	processQuery(Model, query) {
		let is_colletction = Model.isCollection(query);

		if (!is_colletction) return Promise.resolve([query])

		if (query.counter == '*') {
			let counterquery = _.cloneDeep(query);
			_.unset(counterquery, 'counter');

			let description = Model.description();
			let counter_name = description.counter;

			return this.get(counter_name, counterquery)
				.then(counter => counter.range(counterquery))
				.then(range => _.map(range, index => _.set(_.clone(query), 'counter', index)));
		}
	}
	composeDescription(Model, params) {
		//@NOTE: temp decision for explicitly specified key
		//@TODO: build query from keys
		//
		let first = _.head(params);
		if (first && first.key) return [_.castArray(first.key)];

		let description = Model.description();
		let chain = resolveParents(Model);
		let keys = _.map(chain, i => Templatizer(i.description().key, params));

		return keys;
	}
}


module.exports = Patchwerk;
