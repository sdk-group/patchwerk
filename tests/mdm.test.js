'use strict'

let QueryIterator = require('./query-iterator.js');


describe.only('some tests', () => {
	let iterator;
	let cursor;
	let counter = 100000;

	describe('incCursor x' + counter, () => {
		beforeEach(() => {
			iterator = new QueryIterator({
				x: [1, 2, 3],
				y: [5, 6, 7],
				q: 1
			});
		});

		it('cursor', () => {
			// console.log([...iterator]);
			for (var i = 0; i < counter; i++) {
				for (let variable of iterator) {
					let x = variable;
				}
			}

		})

		it('MR', () => {
			for (var i = 0; i < counter / 100; i++) {
				let x = Math.random();
			}

		})


	})
})
