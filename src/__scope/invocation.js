/* jshint ignore:start */
if (typeof define !== 'function') { var define = require('amdefine')(module) }
/* jshint ignore:end */

define(function (require, exports, module) {
	'use strict';


	var _ = require('lodash');

	/*

		var arch = scope({

		});

		arch.fn('alert', function (contextualMessage, msg) {
			return 'DANGER! ' + contextualMessage + ' ' + msg;
		}, ['message']);


		arch.message = 'some message';

		arch.alert();					// 'DANGER! some message'
		arch.alert('More messages')		// 'DANGER! some message More messages'

	*/

	/**
	 * Evaluates necessarily to an array ready to be
	 * passed to function.apply(whatever, args)
	 *
	 * @method evaluateToArguments
	 * @param requiredArgs {Array|Object}
	 * @returns args {Array}
	 */
	exports.evaluateToArguments = function evaluateToArguments(requiredArgs, defaults) {

		// [1] get values
		var values = this.evaluate(requiredArgs);

		// [2] set default values
		if (_.isArray(requiredArgs) && defaults) {
			_.defaults(values, defaults);
		}

		// [3]
		var args = _.isArray(values) ? values : [values];

		return args;
	};

	/**
	 * Invoke any function with the arguments and an optional context.
	 *
	 * @method invoke
	 * @param fn {Function|String}
	 * @param requiredArgs {Array|Object}
	 * @param [context] {whatever}
	 */
	exports.invoke = function invoke(fn, requiredArgs, context, defaults) {

		// [0] get fn
		fn = _.isFunction(fn) ? fn : this[fn];

		// [1] get args
		var args = this.evaluateToArguments(requiredArgs, defaults);

		// [2] invoke
		return fn.apply(context, args);
	};

	/**
	 *
	 * Define a scope-aware function
	 *
	 */
	exports.fn = function defineFn(name, fn, requiredArgs, context, defaults) {

		// [1] get values
		var args = this.evaluateToArguments(requiredArgs, defaults);

		// [2] add the fn, as to make the partialization possible
		args.unshift(fn);

		// [3] partialize
		fn = _.partial.apply(_, args);

		// [4] bind if context availabe
		this[name] = context ? _.bind(fn, context) : fn;

		return this;
	};
});
