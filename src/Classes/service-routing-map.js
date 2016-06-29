'use strict'

let BasicDocument = require('./basic.js');
let _ = require('lodash');

class ServiceRoutingMap extends BasicDocument {
	static description() {
		return {
			"key": "service-routing-map-{department}"
		};
	}
	getRoutes(service_id) {
		let inc_services = this._getLinkedEntries("include", service_id);
		let exc_services = this._getLinkedEntries("exclude", service_id);

		return {
			allowed: inc_services,
			not_allowed: exc_services
		};
	}
	_getLinkedEntries(root, service_id) {
		let rules = _.filter(_.get(this, ["routes", root]), (item) => ~_.castArray(item.from).indexOf(service_id) || ~_.castArray(item.from).indexOf('*'));

		let services = _.chain(rules)
			.map("to")
			.flatten()
			.uniq()
			.value();

		return ~services.indexOf("*") ? "*" : services;
	}
}

module.exports = ServiceRoutingMap;
