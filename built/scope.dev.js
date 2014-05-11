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

define('__scope/evaluation/string/parse',['require','exports','module','lodash'],function (require, exports, module) {
	

	var _ = require('lodash');

	/**
	 * \s*      -> any (*) number of whitespace characters
	 * (?:      -> start non-capturing group of options
	 *  (        -> start KEY&VALUE-REFERENCE capturing group
	 *   [^:]+?   -> match anything but colon ([^:]) at least once (+) non-greedy (?)
	 *  )        -> close KEY&VALUE-REFERENCE capturing group
	 *  |        -> or
	 *  (?:      -> start KEY-ONLY & VALUE-REFERENCE-ONLY non-capturing group
	 *   (        -> start KEY-ONLY capturing group
	 *    [^:]+?   -> match anything but colon ([^:]) at least once (+) non-greedy (?)
	 *   )        -> close KEY-ONLY capturing group
	 *   :        -> match the colon (KEY:VALUE separator)
	 *   (        -> start VALUE-REFERENCE capturing group
	 *    .+?      -> match anything (.) at least once (+) non-greedy (?)
	 *   )        -> close VALUE-REFERENCE capturing group
	 *  )        -> close KEY-ONLY & VALUE-REFERENCE-ONLY non-capturing group
	 * )        -> close non-capturing group of options
	 * \s*      -> match any number (*) of whitespace characters (\s)
	 * (?:,|$)  -> until the comma or end of string
	 */

	// sample object string: "$arg3, key: $arg4, key1: literalValue"

	/**
	 *
	 * (\$\w+) -> KEY&EVALUATED 		[1]
	 *
	 * (?:
	 *  (\w+) -> LITERAL KEY 		[2]
	 *  :\s*
	 *  (?:
	 *   (\w+)  -> LITERAL VALUE 	[3]
	 *   |
	 *   (\$\w+) -> EVALUATED VALUE 	[4]
	 *  )
	 * )
	 */
	var keyMatcher = /(?:\$(\w+)|(?:(\w+):\s*(?:(\w+)|\$(\w+))))\s*(?:,|$)/g;

/*
	/(?:
		(\$\w+)
		|
		(?:
			(\w+):\s*
			(?:
				(\$\w+)
				|
				(\w+)
			)
		)
	)
	\s*
	(?:,|$)/g;
*/

	function parseObjectStr(str) {

		var res = {},
			keyMatch;

		while (keyMatch = keyMatcher.exec(str)) {

			// [0] full matched string
			// [1] captured KEY&EVALUATED
			// [2] captured LITERAL KEY
			// [3] captured EVALUATED VALUE
			// [4] captured LITERAL VALUE

			if (keyMatch[1]) {
				// key & evaluated value

				res[keyMatch[1]] = {
					type: 'evaluated',
					value: keyMatch[1]
				};

			} else if (keyMatch[2]) {
				// literal alias key

				if (keyMatch[3]) {
					// literal value
					res[keyMatch[2]] = {
						type: 'literal',
						value: keyMatch[3]
					};

				} else if (keyMatch[4]) {
					// evaluated value
					res[keyMatch[2]] = {
						type: 'evaluated',
						value: keyMatch[4]
					};
				}

			}

		}

		return res;

	}


	/**
	 * \s*            -> any number of whitespaces
	 *  (?:            -> start non-capturing OR group
	 *   ($\w+)         -> capture EVALUATED
	 *  |              -> OR
	 *   (\w+)          -> capture LITERAL
	 *  |              ->OR
	 *   \{             -> match "{" followed by any number of whitespace characters
	 *   \s*            ->
	 *   (.*?)          -> capture OBJECT
	 *   \s*\}          -> match "}" preceded by any number of whitespace characters
	 *  )              -> close non-capturing OR group
	 *  \s*            -> followed by any number of whitespace characters
	 *  (?:,|$)        -> until a comma or the end of the string.
	 */

	// sample arguments string: "literal, $evaluated, {$arg3, key: $arg4}"
	var argMatcher = /\s*(?:(\w+)|\$(\w+)|\{\s*(.*?)\s*\})\s*(?:,|$)/g;
	module.exports = function parseArgumentsStr(str) {
		// results
		var res = [],
			argMatch;

		while (argMatch = argMatcher.exec(str)) {

			// [0] the matched string
			// [1] captured LITERAL arg
			// [2] captured EVALUATED arg
			// [3] captured OBJECT arg

			if (argMatch[1]) {
				// LITERAL
		//		console.log('LITERAL: ' + argMatch[1]);

				res.push({
					type: 'literal',
					value: argMatch[1]
				});

			} else if (argMatch[2]) {
				// EVALUATED
		//		console.log('EVALUATED: ' + argMatch[2]);
				res.push({
					type: 'evaluated',
					value: argMatch[2]
				});


			} if (argMatch[3]) {
				// OBJECT
		//		console.log('OBJECT: ' + argMatch[3]);

				res.push({
					type: 'object',
					value: parseObjectStr(argMatch[3])
				});
			}
		}

		return res;
	};
});


/*

scope.partial(fn, ['key', 'key1'])

*/
;
/* jshint ignore:start */

/* jshint ignore:end */

define('__scope/evaluation/string/index',['require','exports','module','lodash','./parse'],function (require, exports, module) {
	


	var _ = require('lodash');

	var parseArgumentsStr = require('./parse');



	function evaluateCriterion(scope, criterion, options) {

		if (criterion.type === 'literal') {
			// literal
			return criterion.value;
		} else if (criterion.type === 'evaluated') {
			// evaluated
			return scope[criterion.value];
		} else {
			// object
			return evaluateObject(scope, criterion.value, options);
		}
	}


	function evaluateObject(scope, criteria, options) {
		var res = {};

		_.each(criteria, function (criterion, prop) {
			res[prop] = evaluateCriterion(scope, criterion, options);
		});

		return res;
	}


	function evaluateArray(scope, criteria, options) {

		var res = [];

		_.each(criteria, function (criterion) {

			res.push(evaluateCriterion(scope, criterion, options))
		}, scope);

		return res;
	}


	module.exports = function evaluateString(scope, criteria, options) {

		if (options.own) {

		} else {


			// [1] parse criteria
			criteria = parseArgumentsStr(criteria);


			return evaluateArray(scope, criteria, options);
		}

	};
});

/* jshint ignore:start */

/* jshint ignore:end */

define('__scope/evaluation/index',['require','exports','module','lodash','./string/index'],function (require, exports, module) {
	


	var _ = require('lodash');


	var evaluateString = require('./string/index');


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


		} else if (_.isObject(criteria)) {
			// return object

			return evaluateObject(this, criteria, options);

		} else if (_.isString(criteria)) {

			return evaluateString(this, criteria, options);
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

define('scope',['require','exports','module','lodash','subject','./__scope/iteration','./__scope/evaluation/index','./__scope/invocation'],function (require, exports, module) {
	


	var _       = require('lodash'),
		subject = require('subject');

	// non enumerable descriptor
	var nonEnum      = { enumerable: false },
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
		.assignProto(require('./__scope/evaluation/index'), nonEnumWrite)
		.assignProto(require('./__scope/invocation'), nonEnumWrite);
});

