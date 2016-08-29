'use strict'

class Cursor {
	constructor(name, entry) {
		this.name = name;
		this.entry = entry;
		this.is_iterable = entry.constructor === Array


		this.value = this.is_iterable ? this.entry[0] : this.entry;
		if (this.is_iterable) {
			this.pos = 0;
			this.isIterable = entry.constructor === Array;
			this.max = entry.length;
		}
	}
	reset() {
		this.pos = 0;
	}
	inc() {
		if (!this.is_iterable || this.pos + 1 >= this.max) return false;
		this.pos++;
		this.value = this.entry[this.pos];
		return true
	}
}

module.exports = Cursor;
