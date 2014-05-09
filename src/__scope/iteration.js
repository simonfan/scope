/* jshint ignore:start */
if (typeof define !== 'function') { var define = require('amdefine')(module) }
/* jshint ignore:end */

define(function (require, exports, module) {
	'use strict';


	var _ = require('lodash');


	/**
	 *
	 * For in
	 * @param [filter] {Array|RegExp}
	 * @param fn {Function}
	 * @param [context] {Whatever}
	 */
	exports.each = function each() {

		var filter, fn, context;

		if (_.isFunction(arguments[0])) {
			// unfiltered loop
			fn      = arguments[0];
			context = arguments[1];

			for (var prop in this) {
				fn.call(context, this[prop], prop);
			}

		} else {
			// filtered loop
			filter  = arguments[0];
			fn      = arguments[1];
			context = arguments[2];


			if (_.isRegExp(filter)) {

				for (var prop in this) {
					if (filter.test(this[prop])) {
						fn.call(context, this[prop], prop);
					}
				}
			} else if (_.isArray(filter)) {
				_.each(filter, function (prop) {
					fn.call(context, this[prop], prop);
				});
			}
		}

		return this;
	};
	/**
	 *
	 * @param [filter] {Array|RegExp}
	 * @param fn {Function}
	 * @param [context] {Whatever}
	 */
	exports.eachOwn = function eachOwn() {
		var filter, fn, context;

		if (_.isFunction(arguments[0])) {
			// unfiltered loop
			fn      = arguments[0];
			context = arguments[1];

			_.each(this, fn, context);

		} else {
			// filtered loop
			filter  = arguments[0];
			fn      = arguments[1];
			context = arguments[2];

			if (_.isRegExp(filter)) {
				_.each(this, function (value, prop) {

					if (filter.test(prop)) {
						fn.call(context, value, prop);
					}

				});

			} else if (_.isArray(filter)) {
				_.each(filter, function (prop) {

					if (this.hasOwnProperty(prop)) {

						fn.call(context, this[prop], prop);
					}
				}, this);
			}
		}

		return this;
	};


















	/// pick
	function buildRegExpConditon(criteria) {

		return function regExpCondition(value, prop) {
			return criteria.test(prop);
		};
	}


	exports.pick = function pick(criteria, context) {

		context = context || this;

		var res = {};


		if (_.isArray(criteria)) {

			// array picker
			_.each(criteria, function (prop) {
				res[prop] = this[prop];
			}, this);

		} else {
			//

			// convert NON-FUNCTION criteria into function.
			if (_.isRegExp(criteria)) {
				// regexp
				criteria = buildRegExpConditon(criteria);

			}

			// loop
			this.each(function (value, prop) {
				if (criteria.apply(context, arguments)) {
					res[prop] = value;
				}
			});

		}

		return res;
	};

	exports.pickOwn = function pickOwn(criteria, context) {

		if (_.isRegExp(criteria)) {
			criteria = buildRegExpConditon(criteria);

		}

		return _.pick(this, criteria, context);
	};

});
