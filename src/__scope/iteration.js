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

	/**
	 *
	 * For in
	 */
	exports.each = function each(fn, context) {
		for (var prop in this) {
			fn.call(context, this[prop], prop);
		}

		return this;
	};

	exports.eachOwn = function eachOwn(fn, context) {
		return _.each(this, fn, context);
	};




	/// pick

	exports.pick = function pick(fn, context) {


		if (_.isArray(fn)) {
			// array picker
			return this.evaluate(fn);
		} else {
			// filter

			var res = {};

			this.each(function (value, key) {

				if (fn.call(context, value, key)) {
					res[key] = value;
				}

			});

			return res;
		}
	};

	exports.pickOwn = function pickOwn(fn, context) {
		return _.pick(this, fn, context);
	}
});
