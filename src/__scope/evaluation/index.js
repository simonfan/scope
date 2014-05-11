/* jshint ignore:start */
if (typeof define !== 'function') { var define = require('amdefine')(module) }
/* jshint ignore:end */

define(function (require, exports, module) {
	'use strict';


	var _ = require('lodash');


	var evaluateString = require('./string/index');

	/**
	 * Picks the properties defined by the array
	 * and returns them in an object hash.
	 *
	 * @method evaluateArrayToObject
	 * @param  {Object} scope
	 * @param  {Array} criteria
	 * @param  {Object} options
	 * @return {Object}
	 */
	function evaluateArrayToObject(scope, criteria, options) {
		var res = {};

		if (options.own) {

			_.each(criteria, function (criterion) {
				if (_.isString(criterion) && scope.hasOwnProperty(criterion)) {
					// criterion = 'prop';
					res[criterion] = scope[criterion];
				} else {
					// criterion = subCriteria ([]|{})
					// subevaluate.
					res[criterion] = scope.evaluateOwn(criterion, options);
				}
			});

		} else {

			_.each(criteria, function (criterion) {
				if (_.isString(criterion)) {
					// criterion = 'prop';
					res[criterion] = scope[criterion];
				} else {
					// criterion = subCriteria ([]|{})
					// subevaluate.
					res[criterion] = scope.evaluate(criterion, options);
				}
			});
		}

		return res;
	}

	/**
	 * Picks the properties defined in the criteria array
	 * and returns an array with the values in the required order.
	 *
	 * @method evaluateArrayToArray
	 * @param  {Object} scope
	 * @param  {Array} criteria
	 * @param  {Object} options
	 * @return {Array}
	 */
	function evaluateArrayToArray(scope, criteria, options) {

		if (options.own) {

			return _.map(criteria, function (criterion) {

				return (_.isString(criterion) && scope.hasOwnProperty(criterion)) ?
					// criterion = 'prop';
					scope[criterion] :
					// criterion = subCriteria ([]|{})
					// subevaluate.
					scope.evaluateOwn(criterion, options);
			});

		} else {

			return _.map(criteria, function (criterion) {
				return _.isString(criterion) ?
					// criterion = 'prop';
					scope[criterion] :
					// criterion = subCriteria ([]|{})
					// subevaluate.
					scope.evaluate(criterion, options);
			});

		}
	}

	/**
	 * Loops through scope properties and picks
	 * those that match the regular expression criteria.
	 *
	 * @method evaluateRegExp
	 * @param  {Object} scope
	 * @param  {RegExp} criteria
	 * @param  {Object} options
	 * @return {Object}
	 */
	function evaluateRegExp(scope, criteria, options) {
		// response always in object format
		var res = {};

		if (options.own) {

			// loop own
			scope.eachOwn(function (value, prop) {
				if (criteria.test(prop)) {
					res[prop] = value;
				}
			});

		} else {

			// loop everything
			scope.each(function (value, prop) {
				if (criteria.test(prop)) {
					res[prop] = value;
				}
			});

		}

		return res;
	}

	/**
	 * Picks the properties defined on the criteria object
	 * from the scope and sets defaults.
	 *
	 * @method evaluateObject
	 * @param  {Object} scope
	 * @param  {Object} criteria
	 * @param  {Object} options
	 * @return {Object}
	 */
	function evaluateObject(scope, criteria, options) {
		var res = {};

		if (options.own) {
			_.each(criteria, function (value, prop) {

				if (scope.hasOwnProperty(prop)) {
					res[prop] = scope[prop];
				}

			});

		} else {

			_.each(criteria, function (value, prop) {
				res[prop] = scope[prop];
			});

		}

		// set defaults
		_.defaults(res, criteria);

		return res;
	}

	/**
	 * The public method. Just chooses the right method to run
	 * based on arguments and options
	 *
	 * @param {Array|Object|Regexp|String} criteria
	 * @param options {Object}
	 *     @param own {Boolean}
	 *     @param format {String}
	 */
	exports.evaluate = function evaluate(criteria, options) {

		options = options || {};

		if (_.isArray(criteria)) {

			if (options && options.format === 'object') {

				// array -> object
				return evaluateArrayToObject(this, criteria, options);

			} else {
				// array -> array
				return evaluateArrayToArray(this, criteria, options);
			}

		} else if (_.isRegExp(criteria)) {

			return evaluateRegExp(this, criteria, options);


		} else if (_.isObject(criteria)) {
			// return object

			return evaluateObject(this, criteria, options);

		} else if (_.isString(criteria)) {

			return evaluateString(this, criteria, options);
		}
	};

});
