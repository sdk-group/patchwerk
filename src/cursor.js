'use strict'

class Cursor {
	constructor(name, entry) {
		this.name = name;
		this.entry = entry;
		this.pos = 0;
		this.max = entry.length || 0;
	}
	reset() {
		this.pos = 0;
	}
	inc() {
		if (this.pos + 1 >= this.max) return false;
		this.pos++;
		return true
	}
	value() {
		return this.max ? this.entry[this.pos] : this.entry;
	}
}

module.exports = Cursor;
