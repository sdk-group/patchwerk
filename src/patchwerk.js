'use strict'

const _ = require('lodash');

const Templatizer = require('./utils/templatizer.js');

const QueryIterator = require('./query-iterator.js');
const MetaDocument = require('./meta-document-model.js');

let discover = function(model_name) {
	let name = _.kebabCase(model_name);
	return require(`./classes/${name}.js`)
}

class Patchwerk {
	constructor(emitter) {
		this.emitter = emitter;
	}
	get(model_def, query, options) {
		let metaDocument = new MetaDocument(model_def, options);

		return this.processQuery(metaDocument, query)
			.then(query_params => metaDocument.getKeys(query_params))
			.then(uniq_subset => this.getSoruceData(uniq_subset))
			.then(data => metaDocument.build(data));
	}
	processQuery(Model, query) {
		let is_colletction = Model.isCollection(query);
		console.log('is_collection', is_colletction, query);
		if (!is_colletction) return Promise.resolve(query);

		return this.processCounter(Model, query).then(counter => {
			if (counter) query.counter = counter;

			return new QueryIterator(query);
		})
	}
	processCounter(Model, query) {
		let counter_name = Model.getCounter();
		console.log('counter_name', counter_name);
		return !counter_name ? Promise.resolve(false) : this.get(counter_name, query).then(counter => {
			console.log('Counter', counter);
			return counter.range();
		})
	}
	getSoruceData(subset) {
		console.log('keyset', subset);
		return this.emitter.addTask('database.getMulti', {
			args: [subset]
		})
	}
}


module.exports = Patchwerk;
