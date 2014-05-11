/* jshint ignore:start */
if (typeof define !== 'function') { var define = require('amdefine')(module) }
/* jshint ignore:end */

define(function (require, exports, module) {
	'use strict';


	var _ = require('lodash');


	var evaluateString = require('./string/index');


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





	/// regexp
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


	// object
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


	scope.evaluate(['prop1', 'prop2', ['prop3', 'prop4']])


	*/

	/**
	 *
	 * @param options {Object}
	 *     @param own {Boolean}
	 *     @param format {String}
	 */
	exports.evaluate = function evaluate(criteria, options) {

		options = options || {};

		if (_.isArray(criteria)) {

			if (options && options.format === 'object') {

				// array -> object
				return evaluateArrayToObject(this, criteria, options)

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
