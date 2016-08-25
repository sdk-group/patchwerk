'use strict'

const _ = require('lodash');

function ArrayReducer(template, item) {
	return template.replace('{' + item.name + '}', item.value)
};

function ObjectReducer(template, value, param) {
	console.log(value, param, template);
	return template.replace('{' + param + '}', value)
};

function FormTemplateString(template_string, params) {
	let reducer = _.isArray(params) ? ArrayReducer : ObjectReducer;
	return _.reduce(params, reducer, template_string);
};

module.exports = function(template, params) {
	return _.isFunction(template) ? template(params) : FormTemplateString(template, params);
}
