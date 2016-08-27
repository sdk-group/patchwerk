'use strict'

const _ = require('lodash');
const Promise = require('bluebird');

const Templatizer = require('./utils/templatizer.js');

let discover = function(model_name) {
	let name = _.kebabCase(model_name);
	return require(`./classes/${name}.js`)
}

let isIterable = function(obj) {
	if (!obj) {
		return false;
	}
	return !!obj[Symbol.iterator];
}

class MetaModel {
	constructor(model_def, options) {
		this.options = options;
		this.Model = this.getModel(model_def);
		this.ModelChain = this.resolveParents();
		this.descriptions = this.getDescriptions();
	}
	getDescriptions() {
		let len = this.ModelChain.length;
		let desc = Array(len);

		while (len--) {
			let item = this.ModelChain[len];
			desc[len] = item.description();
		}

		return desc;
	}
	getModel(definition) {
		return _.isString(definition) ? discover(definition) : definition
	}
	isCollection(query) {
		let has_counter = this.getCounter();

		if (!has_counter) return false;

		if (query.counter && (query.counter == '*' || query.counter.constructor === Array)) return true;

		for (let name in query) {
			if (query[name].counter && query[name].counter.constructor === Array) return true;
		}

		return false;
	}
	getKeys(query) {
		let templates = this.getTemplates();

		return isIterable(query) ? this._collectionKeys(query, templates) : this._singleObjectKeys(query, templates);
	}
	_collectionKeys(iterator, templates) {
		let object_count = iterator.length();
		let object_counter = 0;
		this.object = Array(object_count);

		let keys = new Set();
		let len = templates.length;
		let i, params, template;

		for (params of iterator) {
			this.object[object_counter++] = this.makeModel(params);

			for (i = 0; i < len; i++) {
				template = templates[i];
				keys.add(Templatizer(template, params));
			}
		}

		return [...keys];
	}
	makeModel(keymap) {
		let Model = this.Model;

		return new Model(keymap);
	}
	_singleObjectKeys(params, templates) {
		let keys = new Set();
		let len = templates.length;
		let template, key;

		let keymap = {
			ids: Array(len)
		};

		while (len--) {
			template = templates[len];
			key = Templatizer(template.key, params);
			keymap.ids[len] = key;

			keys.add(key);
		}

		this.object = this.makeModel(keymap);

		return [...keys];
	}
	build(data) {

		let is_colletction = this.object.constructor === Array;
		return is_colletction ? this._buildCollection(data) : this._buildSingle(data);
	}
	_buildSingle(data) {
		return this.object.pickData(data);
	}
	_buildCollection(data) {
		let len = this.object.length;
		let item;

		while (len--) {
			item = this.object[len];
			item.pickData(data)
		}

		return this.object;

	}
	getTemplates() {
		let model_chain = this.ModelChain;
		//@TODO: resolve links based on model, add them to template list
		return _.transform(this.descriptions, (acc, desc) => {
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
				parent = Object.getPrototypeOf(current) || false;

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
