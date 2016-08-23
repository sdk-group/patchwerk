'use strict'

const _ = require('lodash');

const Templatizer = require('./utils/templatizer.js');

const QueryIterator = require('./query-iterator.js');
const MetaDocument = require('./meta-document-model.js');

let discover = function (model_name) {
	let name = _.kebabCase(model_name);
	return require(`./classes/${name}.js`)
}

class Patchwerk {
	constructor(emitter) {
		this.emitter = emitter;
	}
	get(model_def, query, options) {
		let metaDocument = new MetaDocument(model_def);

		return this.processQuery(metaDocument, query)
			.then(query_params => metaDocument.getKeys(query_params, options))
			.then(uniq_subset => this.getSoruceData(uniq_subset))
			.then(data => metaDocument.build(data, options));
	}
	processQuery(Model, query) {
		let is_colletction = Model.isCollection(query);

		if (!is_colletction) return Promise.resolve(query)

		return this.processCounter(Model, query).then(counter => {
			if (counter) query.counter = counter;

			return new QueryIterator(query);
		})
	}
	processCounter(Model, query) {
		let counter_name = Model.getCounter();

		return !counter_name ? Promise.resolve(false) : this.get(counter_name, query).then(counter => {
			return counter.range();
		})
	}
	getSoruceData(subset) {
		return this.emitter.addTask('database.getMulti', {
			args: [subset]
		})
	}
}


module.exports = Patchwerk;
