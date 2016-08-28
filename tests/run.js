'use strict'

var chai = require('chai');

global.expect = chai.expect;
global._ = require('lodash');
global.Promise = require('bluebird');

var gulp = require("gulp");
var mocha = require('gulp-mocha');
var cas = require('chai-as-promised');
chai.use(cas);

gulp.src('build/**/*.test.js', {
		read: false
	})
	.pipe(mocha());
