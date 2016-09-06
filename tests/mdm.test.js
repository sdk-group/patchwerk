'use strict'

let QueryIterator = require('./query-iterator.js');
let Templatizer = require('./utils/templatizer.js');

describe.only('some tests', () => {
	let iterator;
	let cursor;
	let counter = 1000;

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

	var tc = 1000000;
	describe('Templatizer x' + tc, () => {
		it('template string', () => {

			for (var i = 0; i < tc; i++) {
				var params = {
					x: 1,
					z: 'string',
					q: Math.random()

				};
				var ans = `oooo ${params.x} pppp ${params.z} lllll ${params.q}`;
			}
		})

		it(' Templatizer', () => {
			var params = {
				x: 1,
				z: 'string',
				q: Math.random()

			};
			for (var i = 0; i < tc; i++) {

				var ans = Templatizer('oooo {x} pppp {z} lllll {q}', params)
			}

		})

		it('function summ', () => {
			var params = {
				x: 1,
				z: 'string',
				q: Math.random()

			};
			for (var i = 0; i < tc; i++) {
				var ans = Templatizer((x) => 'oooo ' + x.x + ' pppp ' + x.z + ' lllll ' + x.q, params)
			}
		})

		it('function summ pre computed', () => {
			var params = {
				x: 1,
				z: 'string',
				q: Math.random()

			};
			let strings = ['oooo ', ' pppp ', ' lllll '];
			let p = ['x', 'z', 'q'];
			let f = function() {
				let len = strings.length;
				let result = '';

				while (len--) {
					result = strings[len] + p[len] + result;
				}

				return result
			}
			for (var i = 0; i < tc; i++) {
				var ans = Templatizer(f, params)
			}
		})

		it('tm + tz', () => {
			var params = {
				x: 1,
				z: 'string',
				q: Math.random()

			};

			for (var i = 0; i < tc; i++) {
				var ans = Templatizer((p) => `oooo ${p.x} pppp ${p.z} lllll ${p.q}`, params)
			}
		})


	})
})
