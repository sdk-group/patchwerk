'use strict'

let Patchwerk = require('./patchwerk.js');
let queue = require('global-queue');

describe('Patchwerk siad: "Weee"', () => {
  let p;
  before(() => {
    p = new Patchwerk(queue);
  });

  it('test', () => {
    p.get('Service', {
      department: "dept-1",
      counter: 10
    })
  });
});