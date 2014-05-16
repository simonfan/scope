/* jshint ignore:start */
if (typeof define !== 'function') { var define = require('amdefine')(module) }
/* jshint ignore:end */

define(function (require, exports, module) {
	'use strict';


	var _ = require('lodash');


	var evaluateString = require('./string/index'),
		evaluateArray  = require('./array'),
		evaluateObject = require('./object'),
		evaluateRegExp = require('./regexp');

	/**
	 * The public method. Just chooses the right method to run
	 * based on arguments and options
	 *
	 * @param {Array|Object|Regexp|String} criteria
	 * @param options {Object}
	 *     @param own {Boolean}
	 *     @param format {String}
	 */
	exports.evaluate = function evaluate(criteria, options) {

		options = options || {};

		if (_.isArray(criteria)) {

			return evaluateArray(this, criteria, options);

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
