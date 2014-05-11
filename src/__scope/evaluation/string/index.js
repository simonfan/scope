/* jshint ignore:start */
if (typeof define !== 'function') { var define = require('amdefine')(module) }
/* jshint ignore:end */

define(function (require, exports, module) {
	'use strict';


	var _ = require('lodash');

	var parseArgumentsStr = require('./parse');



	function evaluateCriterion(scope, criterion, options) {

		if (criterion.type === 'literal') {
			// literal
			return criterion.value;
		} else if (criterion.type === 'evaluated') {
			// evaluated
			return scope[criterion.value];
		} else {
			// object
			return evaluateObject(scope, criterion.value, options);
		}
	}


	function evaluateObject(scope, criteria, options) {
		var res = {};

		_.each(criteria, function (criterion, prop) {
			res[prop] = evaluateCriterion(scope, criterion, options);
		});

		return res;
	}


	function evaluateArray(scope, criteria, options) {

		var res = [];

		_.each(criteria, function (criterion) {

			res.push(evaluateCriterion(scope, criterion, options))
		}, scope);

		return res;
	}


	module.exports = function evaluateString(scope, criteria, options) {

		if (options.own) {

		} else {


			// [1] parse criteria
			criteria = parseArgumentsStr(criteria);


			return evaluateArray(scope, criteria, options);
		}

	};
});
