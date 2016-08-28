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
		this.Model = MetaModel.getModel(model_def);
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
	static getModel(definition) {
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
		return isIterable(query) ? this._collectionKeys(query) : this._singleObjectKeys(query);
	}
	_collectionKeys(iterator) {
		let templates = this.descriptions;
		let object_count = iterator.length();
		let object_counter = 0;
		this.object = Array(object_count);

		let keys = new Set();
		let len = templates.length;
		let i, params, template, prev, obj, keymap;

		for (params of iterator) {
			prev = false;
			keymap = {};

			for (i = len - 1; i >= 0; i--) {
				this.makeKeymap(keymap, keys, templates[i], params);
				obj = this.makeModel(keymap, prev, i);
				prev = obj;
			}

			this.object[object_counter++] = obj;
		}

		return [...keys];
	}
	makeModel(keymap, prev, model_index) {
		let Parent = this.ModelChain[model_index];
		let obj = new Parent(keymap, prev);

		return obj;
	}
	_singleObjectKeys(params) {
		let templates = this.descriptions;
		let keys = new Set();
		let len = templates.length;
		let prev = false;
		let obj, keymap;

		while (len--) {
			keymap = {};
			this.makeKeymap(keymap, keys, templates[len], params);
			obj = this.makeModel(keymap, prev, len);
			prev = obj;
		}

		this.object = obj;

		return [...keys];
	}
	makeKeymap(keymap, keyset, template, params) {
		let key = params.key ? params.key : Templatizer(template.key, params);
		keymap.id = key;
		keyset.add(key);
		//@TODO: resolve external fields here
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
