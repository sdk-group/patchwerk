'use strict'

const _ = require('lodash');

function ArrayReducer(template, item) {
	return template.replace('{' + item.name + '}', item.value)
};

function ObjectReducer(template, value, param) {
	return template.replace('{' + param + '}', value)
};

function FormTemplateString(template_string, params) {
	let reducer = _.isArray(params) ? ArrayReducer : ObjectReducer;
	return _.reduce(params, reducer, template_string);
};

module.exports = function (tempalte, params) {
	return _.isFunction(tempalte) ? template(params) : FormTemplateString(template, params);
}
