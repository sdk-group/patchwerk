'use strict'

const _ = require('lodash');

const Cursor = require('./cursor.js');

class QueryIterator {
	constructor(query) {
		this.query = query;
		this.cursors = this.initCursors();
	}
	initCursors() {
		let cursors = [];
		let name;
		for (name in this.query) {
			let entry = this.query[name];
			cursors.push(new Cursor(name, entry));
		}

		return cursors;
	}
	incCursor() {
		let cursors = this.cursors;
		let len = cursors.length;
		let i;

		for (i = 0; i < len; i++) {
			let cursor = cursors[i];
			if (cursor.inc()) return true;
			cursor.reset();
		}

		return false;
	}

	*
	[Symbol.iterator]() {
		let _this = this;
		let cursors = this.initCursors();
		let flag = true;
		while (flag) {
			let len = cursors.length;
			let acc = {};

			while (len--) {
				let cursor = cursors[len];
				acc[cursor.name] = cursor.value();
			}
			yield acc;

			flag = this.incCursor(cursors);
		}
	}

}

module.exports = QueryIterator;
