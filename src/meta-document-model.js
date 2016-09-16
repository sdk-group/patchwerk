'use strict'

const _ = require('lodash');
const Promise = require('bluebird');

const Templatizer = require('./utils/templatizer.js');

let isIterable = function (obj) {
	if (!obj) {
		return false;
	}
	return !!obj[Symbol.iterator];
}

class MetaModel {
	constructor(Model, options) {
		this.options = options;
		this.Model = Model;
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
	getFirstKey() {
		return this.object.id;
	}

	getKeys(query) {
		let templates = this.descriptions;
		let keys = new Set();
		let len = templates.length;
		let prev = false;
		let obj, keymap;

		while (len--) {
			keymap = {};
			this.makeKeymap(keymap, keys, templates[len], params);
			obj = this.makeModel(keymap, prev, len);
			obj.setCreationParams(params);
			prev = obj;
		}

		this.object = obj;

		return [...keys];
	}
	makeModel(keymap, prev, model_index) {
		let Parent = this.ModelChain[model_index];
		let obj = new Parent(keymap, prev);

		return obj;
	}
	makeKeymap(keymap, keyset, template, params) {
		//@TODO: maybe move it to class?
		let key = params.key ? params.key : Templatizer(template.key, params);
		keymap.id = key;
		keyset.add(key);

		//@TODO: do it better on Collection
		if (template.counter) keymap.counter = Templatizer(template.counter, params);

		//@TODO: resolve external fields here
	}
	build(data) {
		return this.object.pickData(data);
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
