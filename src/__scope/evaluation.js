//     scope
//     (c) simonfan
//     scope is licensed under the MIT terms.

/**
 * AMD and CJS module.
 *
 * @module scope
 */

/* jshint ignore:start */
if (typeof define !== 'function') { var define = require('amdefine')(module) }
/* jshint ignore:end */

define(function (require, exports, module) {
	'use strict';


	var _ = require('lodash');
	/// evaluate


	exports.evaluate = function evaluate(criteria, options) {

		var res;

		if (_.isArray(criteria)) {

			if (options && options.format === 'object') {
				// return object
				res = this.pick(criteria);

			} else {
				// return array
				res = _.map(criteria, function (prop) {
					return this[prop];
				}, this);
			}

		} else if (_.isRegExp(criteria)) {
			// return object
			res = this.pick(criteria);
		} else {
			// return object
			res = this.pick(_.keys(criteria));
			_.defaults(res, criteria);
		}

		return res;
	};

	exports.evaluateOwn = function evaluateOwn(criteria, options) {

		var res;

		if (_.isArray(criteria)) {

			if (options && options.format === 'object') {
				// return object
				res = this.pickOwn(criteria);
			} else {
				// return array
				res = _.map(criteria, function (prop) {
					if (this.hasOwnProperty(prop)) {
						return this[prop];
					}
				});
			}

		} else if (_.isRegExp(criteria)) {
			// return object
			res = this.pickOwn(criteria);
		} else {
			// return object
			res = this.pickOwn(_.keys(criteria));
			_.defaults(res, criteria);
		}

		return res;
	};
});
