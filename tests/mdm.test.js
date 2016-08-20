'use strict'

let QueryIterator = require('./query-iterator.js');

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
        cursor = {
          x: {
            pos: 0,
            max: 2
          },
          y: {
            pos: 0,
            max: 3
          },
          z: {
            pos: 0,
            max: 3
          }
        };

        for (var i = 0; i < 18; i++) {
          let status = iterator.incCursor(cursor);
        }
      }
    })
    it('cursorLodash', () => {
      for (var x = 0; x < counter; x++) {
        cursor = {
          x: {
            pos: 0,
            max: 2
          },
          y: {
            pos: 0,
            max: 3
          },
          z: {
            pos: 0,
            max: 3
          }
        };

        for (var i = 0; i < 18; i++) {
          let status = iterator.incCursorLodash(cursor);
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
