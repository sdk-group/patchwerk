'use strict'

const _ = require('lodash');

class QueryIterator {
	constructor(query) {
		this.query = query;
	}
	initCursors() {
		let cursors = {};

		_.forEach(this.query, (entry, name) => {
			let max = _.isArray(entry) ? entry.length : -1;
			cursors[name] = {
				pos: 0,
				max: max
			};
		});

		return cursors;
	}
	incCursorArray(cursors) {
		let len = cursors.length;
		let i;
		for (i = 0; i < len; i++) {
			let cursor = cursors[i];
			if (cursor.pos + 1 < cursor.max) {
				cursor.pos++;
				return true;
			} else if (cursor.pos + 1 == cursor.max) {
				cursor.pos = 0;
			}
		}

		return false;
	}
	incCursorArrayTyped(cursors) {
		let len = cursors.length;
		let i;
		for (i = 0; i < len; i++) {
			let cursor = cursors[i];
			if (cursor.inc()) return true;
			cursor.reset();
		}

		return false;
	}
	incCursorLodash(cursors) {
		let done = false;
		_.forEach(cursors, cursor => {
			if (cursor.pos + 1 < cursor.max) {
				cursor.pos++;
				done = true;
				return false;
			} else if (cursor.pos + 1 == cursor.max) {
				cursor.pos = 0;
			}
		})

		return done;
	}
	incCursor(cursors) {
		let cursor_name;
		for (cursor_name in cursors) {
			let cursor = cursors[cursor_name];
			if (cursor.pos + 1 < cursor.max) {
				cursor.pos++;
				return true;
			} else if (cursor.pos + 1 == cursor.max) {
				cursor.pos = 0;
			}
		}

		return false;
	}
	incCursorMap(cursors) {
		let cursor;
		for (cursor in cursors.values()) {
			if (cursor.pos + 1 < cursor.max) {
				cursor.pos++;
				return true;
			} else if (cursor.pos + 1 == cursor.max) {
				cursor.pos = 0;
			}
		}

		return false;
	}

	[Symbol.iterator]() {
		let _this = this;
		let cursors = this.initCursors();

		return {
			next: function() {

			}
		}
	}

}

module.exports = QueryIterator;
