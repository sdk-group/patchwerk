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
		let metaDocument = new MetaDocument(model_def, options);

		return this.processQuery(metaDocument, query)
			.then(query_params => metaDocument.getKeys(query_params))
			.then(uniq_subset => this.getSourceData(uniq_subset))
			.then(data => metaDocument.build(data));
	}
	create(model_def, source, query) {
		let metaDocument = new MetaDocument(model_def, {});

		return this.processCreateQuery(metaDocument, query)
			.then(query_params => metaDocument.getKeys(query_params))
			.then(() => {
				let data = {};
				let id = metaDocument.getFirstKey();
				data[id] = {
					value: source
				};
				return metaDocument.build(data)
					.changed();
			});
	}
	save(model, query) {
		let is_changed = model.isChanged();

		if (!is_changed) return Promise.resolve(true);

		return this._complete(model, query)
			.then(completeModel => completeModel.getSource())
			.then(sourceData => this.saveSourceData(sourceData))
			.then(status => status && model.saved());
	}
	_complete(model, query) {
		let is_complete = model.isComplete();

		if (is_complete) return Promise.resolve(model);

		return this.getCounter(model, query)
			.then(counter => counter && counter.inc(this.emitter))
			.then(index => {
				if (index === false) throw new Error('can not inc() counter');

				return model.updateCounter(index);
			})
	}
	processCreateQuery(Model, query) {
		//@TODO: check if it's complete object description or not

		return Promise.resolve(query);
	}
	processQuery(Model, query) {
		let is_colletction = Model.isCollection(query);

		if (!is_colletction) return Promise.resolve(query);

		return this.processCounter(Model, query)
			.then(counter => {
				if (counter) query.counter = counter;

				return new QueryIterator(query);
			})
	}
	getCounter(model, query) {
		let counter_name = model.getCounter();

		return !counter_name ? Promise.resolve(false) : this.get(counter_name, query)
	}
	processCounter(Model, query) {
		if (query.counter.constructor === Array) return Promise.resolve(query.counter);

		return this.getCounter(Model, query)
			.then(counter => counter && counter.range());
	}
	getSourceData(subset) {
		return this.emitter.addTask('database.getMulti', {
			args: [subset]
		})
	}
	saveSourceData(datamap) {
		return this.emitter.addTask('database.upsertNodes', {
			args: [datamap]
		})
	}
}


module.exports = Patchwerk;