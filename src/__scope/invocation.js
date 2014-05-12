/* jshint ignore:start */
if (typeof define !== 'function') { var define = require('amdefine')(module) }
/* jshint ignore:end */

define(function (require, exports, module) {
	'use strict';


	var _ = require('lodash');

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

		// [1] get scopeArgs\
		var args = this.evaluate(scopeArgs);
		args = _.isArray(args) ? args : [args];

		// [2] invoke
		return fn.apply(null, args.concat(Array.prototype.slice.call(arguments, 2)));
	};

	/**
	 * Creates a function that will have the first arguments
	 * bound to the scope.
	 *
	 * @method partial
	 * @param  {Function} fn        [description]
	 * @param  {Array|Object|RegExp|String}   scopeArgs [description]
	 * @return {Function}             [description]
	 */
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
