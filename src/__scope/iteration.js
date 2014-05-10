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

});
