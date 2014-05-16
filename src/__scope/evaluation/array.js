/* jshint ignore:start */
if (typeof define !== 'function') { var define = require('amdefine')(module) }
/* jshint ignore:end */

define(function (require, exports, module) {
	'use strict';


	var _ = require('lodash');
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
	 * The interface.
	 *
	 * @param  {[type]} scope    [description]
	 * @param  {[type]} criteria [description]
	 * @param  {[type]} options  [description]
	 * @return {[type]}          [description]
	 */
	module.exports = function evaluateArray(scope, criteria, options) {

		if (options && options.format === 'object') {

			// array -> object
			return evaluateArrayToObject(scope, criteria, options);

		} else {
			// array -> array
			return evaluateArrayToArray(scope, criteria, options);
		}
	}

});
