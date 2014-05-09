/* jshint ignore:start */

/* jshint ignore:end */

define('__scope/iteration',['require','exports','module','lodash'],function (require, exports, module) {
	


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
	var nonEnum = {
		enumerable: false
	};

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
		.assignProto(require('./__scope/iteration'), nonEnum)
		.assignProto(require('./__scope/evaluation'), nonEnum)
		.assignProto(require('./__scope/invocation'), nonEnum);
});

