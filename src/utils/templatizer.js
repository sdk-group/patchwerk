'use strict'

const _ = require('lodash');

function FormTemplateString(template_string, params) {
	return _.reduce(params, (template, value, param) => template.replace('{' + param + '}', value), template_string);
};

module.exports = function (tempalte, params) {
	return _.isFunction(tempalte) ? template(params) : FormTemplateString(template, params);
}
