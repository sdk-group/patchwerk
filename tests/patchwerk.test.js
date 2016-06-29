'use strict'

let Patchwerk = require('./patchwerk.js');
let queue = require('global-queue');
let couchbird = require('Couchbird')({
	"server_ip": "194.226.171.100",
	"n1ql": "194.226.171.100:8093"
});



let Database = require('../node_modules/iris-service-database/build/Database/database.js');
let db = new Database();

db.init({
	"default_bucket": "rdf"
});

queue.listenTask('database.get', function (id) {
	return db.get({
		args: arguments
	});
});

queue.listenTask('database.getMulti', function (ids) {
	return db.getMulti({
		args: arguments
	});
});


describe('Fresh data!', () => {
	let p;
	before(() => {
		p = new Patchwerk(queue);
	});

	it('Single', () => {
		p.get('Service', {
			department: "department-1",
			counter: 1
		}).then(d => {
			console.log(d);
		})
	});
	it('Collection', () => {
		p.get('Service', {
			department: "department-1",
			date: "2016-06-20",
			counter: '*'
		}).then(d => {
			console.log(d.length)
		})
	});

	it('ActiveWorkstation', () => {
		p.get('ActiveWorkstation', {
			department: "department-1",
			counter: '*'
		}).then(d => {
			console.log(d.length)
		})
	});

	it('ServiceRoutingMap', () => {
		p.get('ServiceRoutingMap', {
			department: "department-1"
		}).then(d => {
			console.log(d);
			let r = d.getRoutes('service-1');
			console.log(r);
		})
	});
});
