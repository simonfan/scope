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


	var defaultOptions = {

	};

	function evaluateArray(scope, properties, opt) {
		// data = ['prop1', 'prop2', ...]

		// get the values
		var res = _.map(properties, function (property) {
			return scope[property];
		});

		return (opt.to && opt.to === 'object') ?
			// response must be cast to object
			_.zipObject(properties, res) :
			// response as is.
			res;
	}

	function evaluateObject(scope, obj, opt) {
		// obj = { prop1: 'default-prop1-value', prop2: 'default-prop2-value', ... }

		// get the values.
		var res = _.mapValues(obj, function (defaultValue, property) {
			var value = scope[property];

			return _.isUndefined(value) ? defaultValue : value;
		});

		if (opt.to && opt.to === 'array') {
			// response must be cast to array

			return !opt.order ?
				// return the array in natural order (whatever that means)
				_.values(object) :
				// return the array in the order required.
				_.map(opt.order, function (key) {
					return res[key];
				});

		} else {
			// response is in the object normal format
			return res;
		}
	}

	function evaluateString(scope, string, options) {
		return scope[string];
	}

	exports.evaluate = function evaluate(data, options) {
		options = options || {};

		if (_.isArray(data)) {

			return evaluateArray(this, data, options);

		} else if (_.isObject(data)) {

			return evaluateObject(this, data, options);

		} else if (_.isString(data)) {
			// data = 'prop1'
			return evaluateString(this, data, options);
		}
	};
});
