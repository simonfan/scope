/* jshint ignore:start */
if (typeof define !== 'function') { var define = require('amdefine')(module) }
/* jshint ignore:end */

define(function (require, exports, module) {
	'use strict';


	var _ = require('lodash');

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
	module.exports = function evaluateObject(scope, criteria, options) {
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
	};

});
