'use strict'

let QueryIterator = require('./query-iterator.js');

class Cursor {
	constructor(name, max) {
		this.pos = 0;
		this.name = name;
		this.max = max;
	}
	reset() {
		this.pos = 0;
	}
	inc() {
		if (this.pos + 1 == this.max) return false;
		this.pos++;
		return true
	}
}

let makeCursor = function(l) {
	let acc = {};
	l = l || '';
	for (let i = 0; i < 3; i++) {
		acc[i + 'x' + l] = {
			pos: 0,
			max: 3
		};
	}

	return acc;
}

describe.only('some tests', () => {
	let iterator;
	let cursor;
	let counter = 100000;
	describe('incCursor x' + counter, () => {
		beforeEach(() => {
			iterator = new QueryIterator();
		});

		it('cursor', () => {
			for (var x = 0; x < counter; x++) {
				cursor = makeCursor();
				for (var i = 0; i < 18; i++) {
					let status = iterator.incCursor(cursor);
				}
			}
		})
		it('cursor RandomParams', () => {
			for (var x = 0; x < counter; x++) {
				cursor = makeCursor(Math.random());
				for (var i = 0; i < 18; i++) {
					let status = iterator.incCursor(cursor);
				}
			}
		})
		it('cursorLodash', () => {
			for (var x = 0; x < counter; x++) {
				cursor = makeCursor();

				for (var i = 0; i < 18; i++) {
					let status = iterator.incCursorLodash(cursor);
				}
			}
		})
		it('cursorArray', () => {
			for (var x = 0; x < counter; x++) {
				cursor = [{
					pos: 0,
					max: 3,
					name: 'qq1'
				}, {
					pos: 0,
					max: 3,
					name: 'qq2'
				}, {
					pos: 0,
					max: 3,
					name: 'qq3'
				}];

				for (var i = 0; i < 18; i++) {
					let status = iterator.incCursorArray(cursor);
				}
			}
		})
		it('cursorArrayTyped x 10', () => {
			for (var x = 0; x < counter * 10; x++) {
				cursor = [new Cursor('q1', 3), new Cursor('q2', 3), new Cursor('q3', 3)];

				for (var i = 0; i < 18; i++) {
					let status = iterator.incCursorArrayTyped(cursor);
				}
			}
		})
		it('cursorMap', () => {
			for (var x = 0; x < counter; x++) {
				cursor = new Map();

				cursor.set("x", {
					pos: 0,
					max: 2
				});
				cursor.set("y", {
					pos: 0,
					max: 3
				});
				cursor.set("z", {
					pos: 0,
					max: 3
				});

				for (var i = 0; i < 18; i++) {
					let status = iterator.incCursorLodash(cursor);
				}
			}
		})
	})
})
