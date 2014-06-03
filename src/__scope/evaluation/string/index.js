/* jshint ignore:start */
if (typeof define !== 'function') { var define = require('amdefine')(module) }
/* jshint ignore:end */

define(function (require, exports, module) {
	'use strict';


	var _    = require('lodash'),
		deep = require('deep');

	var parseArgumentsStr = require('./parse');


	/**
	 * @method evaluate
	 * @param  {Object} scope
	 * @param  {Object} criterion
	 *     @param {String} type Describes the evaluator to be used
	 *     @param {*} value
	 * @param  {Objects} options
	 * @return {Object|Array|*}
	 */
	function evaluate(scope, criterion, options) {

		var res;

		if (criterion.type === 'literal') {
			// literal
			res = criterion.value;
		} else if (criterion.type === 'evaluated') {
			// evaluated
			res = deep.get(scope, criterion.value);

		} else if (criterion.type === 'array') {

			// array
			res = evaluateArray(scope, criterion.value, options);

		} else if (criterion.type === 'object') {
			// object
			res = evaluateObject(scope, criterion.value, options);

		} else if (criterion.type === 'special' && criterion.value === 'this') {
			// special
			res = scope;
		}

		return res;
	}

	/**
	 * Evaluates an object criteria
	 *
	 * PERHAPS SHOULD MERGE WITH OBJECT EVALUATOR
	 *
	 * @method evaluateObject
	 * @param  {[type]} scope
	 * @param  {[type]} criteria
	 * @param  {[type]} options
	 * @return {[type]}
	 */
	function evaluateObject(scope, criteria, options) {
		var res = {};

		_.each(criteria, function (criterion, prop) {
			res[prop] = evaluate(scope, criterion, options);
		});

		return res;
	}


	function evaluateArray(scope, criteria, options) {

		var res = [];

		_.each(criteria, function (criterion) {

			res.push(evaluate(scope, criterion, options));
		}, scope);

		return res;
	}


	function evaluateValueString(scope, criteria, options) {
		// [1] parse criteria
		criteria = parseArgumentsStr(criteria);

		return evaluate(scope, criteria, options);
	}


	module.exports = evaluateValueString;
});
