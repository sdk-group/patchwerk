'use strict'

let _ = require('lodash');

class BasicDocument {
	constructor(keymap, parent) {
		this.id = keymap.id;
		this.keymap = keymap;
		this.properties = {};
		this.creation_parms = {};
		this.parent = parent;
		this.is_changed = false;
		this.type = _.upperFirst(_.camelCase(this.constructor.name));
	}
	setCreationParams(params) {
		this.creation_parms = params;
		return this;
	}
	getCounter() {
		return this.keymap.counter;
	}
	pickData(dataset) {
		return this.fillParent(dataset)
			.fillThis(dataset);
	}
	fillParent(dataset) {
		this.parent && this.parent.fillThis(dataset);
		return this;
	}
	fillThis(dataset) {
		let id = this.id;
		let data = dataset[id] || {};
		this.properties = data.value || {};
		this.properties['@type'] = this.type;
		//@FIXIT: reomove this!
		this.parent && _.forEach(this.parent.properties, (property, name) => {
			this[name] = property;
		});

		_.forEach(this.properties, (property, name) => {
			this[name] = property
		});
		//@TODO: process links here

		return this;
	}
	get(name, options) {
		let owner = this.findOwner(name);

		if (!owner) return undefined;

		return owner.properties[name];
	}
	set(name, value, options) {
		let owner = this.findOwner(name);

		if (!owner) throw new Error('No such property');

		if (owner.properties[name] === value) return this;

		owner.properties[name] = value;
		this.is_changed = true;

		return this;
	}
	updateCounter(counter) {
		this.id = this.id.replace('*', counter)
		return this;
	}
	findOwner(name) {
		if (typeof this.properties[name] != "undefined") return this;
		if (!this.parent) return false;

		return this.parent.findOwner(name);
	}
	isComplete() {
		return this.id && !~this.id.indexOf('*');
	}
	isChanged() {
		return this.is_changed;
	}
	saved() {
		this.is_changed = false;

		return this;
	}
	changed() {
		this.is_changed = true;

		return this;
	}
	getSource() {
		this.properties['@id'] = this.id;
		return this.properties;
	}
}

module.exports = BasicDocument;
