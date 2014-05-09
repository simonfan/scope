/* jshint ignore:start */

/* jshint ignore:end */

define('__scope/iteration',['require','exports','module','lodash'],function (require, exports, module) {
	


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

/* jshint ignore:start */

/* jshint ignore:end */

define('__scope/evaluation',['require','exports','module','lodash'],function (require, exports, module) {
	


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

/* jshint ignore:start */

/* jshint ignore:end */

define('__scope/invocation',['require','exports','module','lodash'],function (require, exports, module) {
	


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

//     scope
//     (c) simonfan
//     scope is licensed under the MIT terms.

/**
 * AMD and CJS module.
 *
 * @module scope
 */

/* jshint ignore:start */

/* jshint ignore:end */

define('scope',['require','exports','module','lodash','subject','./__scope/iteration','./__scope/evaluation','./__scope/invocation'],function (require, exports, module) {
	


	var _ = require('lodash'),
		subject = require('subject');

	// non enumerable descriptor
	var nonEnum = { enumerable: false },
		nonEnumWrite = { enumerable: false, writable: false };

	var scope = module.exports = subject({

		initialize: function initializeScope(data, descriptor) {
			subject.assign(this, data, descriptor);
		},

		create: function create(data, descriptor) {

			// create the subscope
			var subscope = subject.assign(_.create(this), data, descriptor);

			// set reference to the parentScope (make it non enumerable)
			subject.assign(subscope, { parentScope: this }, nonEnum);

			return subscope;
		},

		assign: function assign(key, value) {
			if (_.isString(key)) {
				this[key] = value;
			} else if (_.isObject(key)) {
				_.assign(this, key);
			}

			return this;
		},

	}, nonEnum);


	// proto
	scope
		.assignProto(require('./__scope/iteration'), nonEnumWrite)
		.assignProto(require('./__scope/evaluation'), nonEnum)
		.assignProto(require('./__scope/invocation'), nonEnum);
});

