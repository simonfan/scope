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

});

/* jshint ignore:start */

/* jshint ignore:end */

define('__scope/evaluation',['require','exports','module','lodash'],function (require, exports, module) {
	


	var _ = require('lodash');


	function evaluateArrayToObject(scope, criteria, options) {
		var res = {};

		if (options.own) {

			_.each(criteria, function (criterion) {
				if (_.isString(criterion) && scope.hasOwnProperty(criterion)) {
					// criterion = 'prop';
					res[criterion] = scope[criterion];
				} else {
					// criterion = subCriteria ([]|{})
					// subevaluate.
					res[criterion] = scope.evaluateOwn(criterion, options);
				}
			});

		} else {

			_.each(criteria, function (criterion) {
				if (_.isString(criterion)) {
					// criterion = 'prop';
					res[criterion] = scope[criterion];
				} else {
					// criterion = subCriteria ([]|{})
					// subevaluate.
					res[criterion] = scope.evaluate(criterion, options);
				}
			});
		}

		return res;
	}

	function evaluateArrayToArray(scope, criteria, options) {

		if (options.own) {

			return _.map(criteria, function (criterion) {

				return (_.isString(criterion) && scope.hasOwnProperty(criterion)) ?
					// criterion = 'prop';
					scope[criterion] :
					// criterion = subCriteria ([]|{})
					// subevaluate.
					scope.evaluateOwn(criterion, options);
			});

		} else {

			return _.map(criteria, function (criterion) {
				return _.isString(criterion) ?
					// criterion = 'prop';
					scope[criterion] :
					// criterion = subCriteria ([]|{})
					// subevaluate.
					scope.evaluate(criterion, options);
			});

		}
	}





	/// regexp
	function evaluateRegExp(scope, criteria, options) {
		// response always in object format
		var res = {};

		if (options.own) {

			// loop own
			scope.eachOwn(function (value, prop) {
				if (criteria.test(prop)) {
					res[prop] = value;
				}
			});

		} else {

			// loop everything
			scope.each(function (value, prop) {
				if (criteria.test(prop)) {
					res[prop] = value;
				}
			});

		}

		return res;
	}


	// object
	function evaluateObject(scope, criteria, options) {
		var res = {};

		if (options.own) {
			_.each(criteria, function (value, prop) {

				if (scope.hasOwnProperty(prop)) {
					res[prop] = scope[prop];
				}

			});

		} else {

			_.each(criteria, function (value, prop) {
				res[prop] = scope[prop];
			});

		}

		// set defaults
		_.defaults(res, criteria);

		return res;
	}

	/**


	scope.evaluate(['prop1', 'prop2', ['prop3', 'prop4']])


	*/

	/**
	 *
	 * @param options {Object}
	 *     @param own {Boolean}
	 *     @param format {String}
	 */
	exports.evaluate = function evaluate(criteria, options) {

		options = options || {};

		if (_.isArray(criteria)) {

			if (options && options.format === 'object') {

				// array -> object
				return evaluateArrayToObject(this, criteria, options)

			} else {
				// array -> array
				return evaluateArrayToArray(this, criteria, options);
			}

		} else if (_.isRegExp(criteria)) {

			return evaluateRegExp(this, criteria, options);


		} else {
			// return object

			return evaluateObject(this, criteria, options);
		}
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

	}, nonEnum);

	// set to unwritable
	scope.proto({

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

	}, nonEnumWrite);


	// proto
	scope
		.assignProto(require('./__scope/iteration'), nonEnumWrite)
		.assignProto(require('./__scope/evaluation'), nonEnumWrite)
		.assignProto(require('./__scope/invocation'), nonEnumWrite);
});

