'use strict'

const _ = require('lodash');

const Cursor = require('./cursor.js');

class QueryIterator {
	constructor(query) {
		this.query = query;
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
	incCursor(cursors) {
		let len = cursors.length;
		let i;

		for (i = 0; i < len; i++) {
			let cursor = cursors[i];
			if (cursor.inc()) return true;
			cursor.reset();
		}

		return false;
	}

	[Symbol.iterator]() {
		let _this = this;
		let cursors = this.initCursors();
		let flag = -1;
		return {
			next: function () {
				flag = (flag === -1) ? true : _this.incCursor(cursors);
				let len = cursors.length;
				let acc = Array(len);

				while (len--) {
					let cursor = cursors[len];
					acc[len] = {
						name: cursor.name,
						value: cursor.value()
					};
				}


				return {
					value: acc,
					done: !flag
				};
			}
		}

	}

}

module.exports = QueryIterator;
