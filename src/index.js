'use strict'

let Patchwerk = require('./patchwerk.js');

module.exports = function (queue) {
	return new Patchwerk(queue);
};
