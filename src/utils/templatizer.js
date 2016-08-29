'use strict'

const _ = require('lodash');


function FormTemplateString(template_string, params) {
	return template_string.replace(/{([^}]+)}/g, (match) => params[match.slice(1, match.length - 1)])
};

module.exports = function(template, params) {
	return _.isFunction(template) ? template(params) : FormTemplateString(template, params);
}
