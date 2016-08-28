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

queue.listenTask('database.get', function (params) {
	return db.get(params);
});

queue.listenTask('database.getMulti', function (params) {
	return db.getMulti(params);
});

queue.listenTask('database.upsertNodes', function (params) {
	return db.upsertNodes(params);
});


describe('Fresh data!', () => {
	let p;
	before(() => {
		p = new Patchwerk(queue);
	});
	describe('Get', () => {
		it('Single', () => {
			p.get('Service', {
				department: "department-1",
				counter: 1
			}).then(d => {
				// console.log('Service id:', d.id);
			})
		});
		it('Collection', () => {
			p.get('Service', {
				department: "department-1",
				date: "2016-06-20",
				counter: '*'
			}).then(d => {
				console.log('Service length:', d.length);
				console.log('Service ID:', d[1].get('@id'))

			})
		});

		it('Ticket', () => {
			p.get('Ticket', {
				key: "ticket-department-1-2016-06-20--1"
			}).then(d => {
				// console.log(d)
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
	describe('Create', () => {
		it('ticket', () => {
			let create = p.create('Ticket', {
				wololo: "ololo"
			}, {
				department: "department-1",
				date: "2016-06-20",
				counter: "*"
			}).
			then(d => d.get('wololo'));


		});

		it('service', () => {
			let create = p.create('Service', {
				label: "test"
			}, {
				department: "department-1",
				counter: "10"
			});

			expect(create).to.eventually.have.deep.property('properties.label', 'test')
		});
	})
	describe('Save', () => {
		it('service', () => {
			let create = p.create('Service', {
					label: "test"
				}, {
					department: "department-1",
					counter: "XXX"
				})
				.then(service => p.save(service))
				.then(c => console.log(c));

		});
	})
});
