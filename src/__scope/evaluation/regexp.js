/* jshint ignore:start */
if (typeof define !== 'function') { var define = require('amdefine')(module) }
/* jshint ignore:end */

define(function (require, exports, module) {
	'use strict';


	var _ = require('lodash');


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
	module.exports = function evaluateRegExp(scope, criteria, options) {
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
	};

});
