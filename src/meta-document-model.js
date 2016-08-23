'use strict'

const _ = require('lodash');
const Promise = require('bluebird');

const Templatizer = require('./utils/templatizer.js');

let discover = function (model_name) {
	let name = _.kebabCase(model_name);
	return require(`./classes/${name}.js`)
}

let isIterable = function (obj) {
	if (!obj) {
		return false;
	}
	return typeof obj[Symbol.iterator] === 'function';
}

class MetaModel {
	constructor(model_def) {
		this.Model = this.getModel(model_def);
		this.ModelChain = this.resolveParents();
	}
	getModel(definition) {
		return _.isString(definition) ? discover(definition) : definition
	}
	isCollection(query) {
		let has_counter = this.getCounter();

		if (!has_counter) return false;

		if (query.counter == '*' || _.isArray(query.counter)) return true;

		for (let name in query) {
			if (_.isArray(query[name])) return true;
		}

		return false;
	}
	getKeys(query, options) {
		let templates = this.getTemplates(options);

		return isIterable(query) ? this._collectionKeys(query, templates) : this._singleObjectKeys(query, templates);
	}
	_collectionKeys(iterator, templates) {
		let keys = new Set();
		let len = templates.length;

		let i, params, template;

		for (params of iterator) {
			for (i = 0; i < len; i++) {
				template = templates[i];
				keys.add(Templatizer(template, params));
			}
		}

		return keys;
	}
	_singleObjectKeys(params, templates) {
		let keys = new Set();
		let len = templates.length;

		while (len--) {
			template = templates[len];
			keys.add(Templatizer(template, params));
		}

		return keys;
	}
	build(data, options) {

	}
	getTemplates(options) {
		let model_chain = this.ModelChain;
		//@TODO: resolve links based on model, add them to template list
		return _.transform(model_chain, (acc, item) => {
			let desc = item.description();
			if (!_.find(acc, ['key', desc.key])) acc.push(desc);
		}, []);
	}
	resolveParents() {
		let model = this.Model;
		let acc = [model];
		let current = model;
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
	getCounter() {
		let counter = false;

		let i, len = this.ModelChain.length;

		for (i = 0; i < len; i++) {
			let desc = this.ModelChain[i].description();

			if (desc && desc.counter) {
				counter = desc.counter;
				break;
			}
		}

		return counter;
	}
}

module.exports = MetaModel;
