'use strict'

class Cursor {
	constructor(name, entry) {
		this.name = name;
		this.entry = entry;
		this.is_iterable = entry.constructor === Array

		if (this.is_iterable) {
			this.pos = 0;
			this.isIterable = entry.constructor === Array;
			this.max = entry.length || 1;
		}
	}
	reset() {
		this.pos = 0;
	}
	inc() {
		if (!this.is_iterable || this.pos + 1 >= this.max) return false;
		this.pos++;
		return true
	}
	value() {
		return this.is_iterable ? this.entry[this.pos] : this.entry;
	}
}

module.exports = Cursor;
