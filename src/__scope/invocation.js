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
	 * @param scopeArgs {Array|Object}
	 * @returns args {Array}
	 */
	exports.evaluateToArguments = function evaluateToArguments(scopeArgs) {

		// [1] get values
		var values = this.evaluate(scopeArgs);

		// [3]
		var args = _.isArray(values) ? values : [values];

		return args;
	};

	/**
	 * Invoke any function with the arguments and an optional context.
	 *
	 * @method invoke
	 * @param fn {Function|String}
	 * @param scopeArgs {Array|Object}
	 * @param [context] {whatever}
	 */
	exports.invoke = function invoke(fn, scopeArgs /*, arg, arg, ... */) {

		// [0] get fn
		fn = _.isFunction(fn) ? fn : this[fn];

		// [1] get scopeArgs
		scopeArgs = this.evaluateToArguments(scopeArgs);

		// [2] invoke
		return fn.apply(null, scopeArgs.concat(Array.prototype.slice.call(arguments, 2)));
	};

	exports.partial = function partial(fn, scopeArgs) {
		return _.partial(this.invoke, fn, scopeArgs);
	};



	/**
	 *
	 * Define/get a scope-aware function
	 *
	 * @param name {String}
	 * @param fn {Function}
	 * @param scopeArgs {Array|Object}
	 */
	exports.fn = function scopeFn(name, fn, scopeArgs) {

		if (arguments.length === 1) {
			return this[name];
		} else {
			this[name] = this.partial(fn, scopeArgs);
		}

		return fn;
	};
});
