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

	exports.eachInherited = function eachInherited() {

		return this.parentScope.each.apply(this.parentScope, arguments);
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

	exports.pickInherited = function pickInherited() {
		return this.parentScope.pick.apply(this.parentScope, arguments);
	};


});
