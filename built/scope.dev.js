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

define('__scope/evaluation/string/parse',['require','exports','module','lodash'],function (require, exports, module) {
	

	var _ = require('lodash');



	/**
	 * Parses out the result from a match result.
	 *
	 * Counts on a pattern of captures,
	 * that are defined in the valueMatcherString
	 */
	function evaluateValueMatch(match) {

		var res = {};

		// [0] the matched string
		// [1] captured LITERAL value
		// [2] captured EVALUATED value
		// [3] captured ARRAY value
		// [4] captured OBJECT value

		if (match[1]) {
			// LITERAL
		//	console.log('LITERAL: ' + match[1]);

			res.type  = 'literal';
			res.value = match[1];

		} else if (match[2]) {
			// EVALUATED
		//	console.log('EVALUATED: ' + match[2]);

			// special keyword $this
			var value = match[2];
			res.type     = value === 'this' ? 'special' : 'evaluated';
			res.value    = value;


		} else if (match[3]) {
			// ARRAY
		//	console.log('ARRAY: ' + match[3]);

			res.type  = 'array';
			res.value = parseArrayString(match[3]);

		} else if (match[4]) {
			// OBJECT
		//	console.log('OBJECT: ' + match[4]);

			res.type  = 'object';
			res.value = parseObjectString(match[4]);
		}

		return res;
	}



	/**
	 * The string that will match out the type and effective value.
	 *
	 * @property valueMatcherString
	 * @type RegExp
	 */
	/* jshint ignore:start */
	var whitespace = '\\s*',
		// no brackets([), braces({), nor commas(,)
		// are allowed in literal values
		literal    = '([^$[{,\\s]+)',
		evaluated  = '\\$([^,]+)?',
		array      = '\\[' + whitespace + '(.*?)' + whitespace + '\\](?!.*?\\])',
		object     = '\\{' + whitespace + '(.*?)' + whitespace + '\\}(?!.*?\\})';

	var valueMatcherString = [
		whitespace + '(?:',
			literal, '|',
			evaluated, '|',
			array, '|',
			object,
		')' + whitespace
	].join('');
	/* jshint ignore:end */

	/**
	 * (\w+) LITERAL
	 * \$([^,]) EVALUATED
	 * \[\s*(.*?)\s*\] ARRAY
	 * \{\s*(.*?)\s*\} OBJECT
	 */
	// sample arguments string: "literal, $evaluated, {$arg3, key: $arg4}"
	var valueMatcher = new RegExp(valueMatcherString);
	function parseValueString(str) {

		var res = {},
			match = str.match(valueMatcher);

		return evaluateValueMatch(match);
	}


	/**
	 *
	 * @property objectValueMatcherString
	 * @type {String}
	 */
	/* jshint ignore:start */
	var objectValueMatcherString = [
		whitespace + '(?:',
			evaluated + whitespace + '(?:,|$)|',
			'(?:',
				literal + whitespace,
				':' + whitespace,
				'(.*?)' + whitespace + '(?:,(?!.*?})|$)',
			')',
		')'
	].join('');
	/* jshint ignore:end */

	/**
	 * Parses a string that represents an object
	 *
	 * @method parseObjectString
	 * @param  {String} str
	 * @return {Object}
	 */
	function parseObjectString(str) {

		var res = {},
			// create the regexp each time the method is called
			// in order to renew the loop
			objectValueMatcher = new RegExp(objectValueMatcherString, 'g'),
			objectValueMatch;

		while (objectValueMatch = objectValueMatcher.exec(str)) {

			// [0] full matched string
			// [1] captured KEY&EVALUATED
			// [2] captured LITERAL KEY
			// [3] captured VALUE STRING

			if (objectValueMatch[1]) {
				// key & evaluated value

				res[objectValueMatch[1]] = {
					type : 'evaluated',
					value: objectValueMatch[1],
				};

			} else if (objectValueMatch[2]) {
				// literal key = value string
				res[objectValueMatch[2]] = parseValueString(objectValueMatch[3]);
			}

		}

		return res;

	}



	// sample array string: "literal, $evaluated, { $deepEval }"
	var arrayValueMatcherString = valueMatcherString + '(?:,|$)';

	/**
	 * Parses a string that represents an arrray.
	 *
	 * @param  {String} str
	 * @return {Array}
	 */
	function parseArrayString(str) {

		var res = [],
			arrayValueMatcher = new RegExp(arrayValueMatcherString, 'g'),
			match;


		while (match = arrayValueMatcher.exec(str)) {
			res.push(evaluateValueMatch(match));
		}

		return res;
	}


	// export the valueString parser
	module.exports = parseValueString;
});

/* jshint ignore:start */

/* jshint ignore:end */

define('__scope/evaluation/string/index',['require','exports','module','lodash','deep','./parse'],function (require, exports, module) {
	


	var _    = require('lodash'),
		deep = require('deep');

	var parseArgumentsStr = require('./parse');


	/**
	 * @method evaluate
	 * @param  {Object} scope
	 * @param  {Object} criterion
	 *     @param {String} type Describes the evaluator to be used
	 *     @param {*} value
	 * @param  {Objects} options
	 * @return {Object|Array|*}
	 */
	function evaluate(scope, criterion, options) {

		var res;

		if (criterion.type === 'literal') {
			// literal
			res = criterion.value;
		} else if (criterion.type === 'evaluated') {
			// evaluated
			res = deep.get(scope, criterion.value);

		} else if (criterion.type === 'array') {

			// array
			res = evaluateArray(scope, criterion.value, options);

		} else if (criterion.type === 'object') {
			// object
			res = evaluateObject(scope, criterion.value, options);

		} else if (criterion.type === 'special' && criterion.value === 'this') {
			// special
			res = scope;
		}

		return res;
	}

	/**
	 * Evaluates an object criteria
	 *
	 * PERHAPS SHOULD MERGE WITH OBJECT EVALUATOR
	 *
	 * @method evaluateObject
	 * @param  {[type]} scope
	 * @param  {[type]} criteria
	 * @param  {[type]} options
	 * @return {[type]}
	 */
	function evaluateObject(scope, criteria, options) {
		var res = {};

		_.each(criteria, function (criterion, prop) {
			res[prop] = evaluate(scope, criterion, options);
		});

		return res;
	}


	function evaluateArray(scope, criteria, options) {

		var res = [];

		_.each(criteria, function (criterion) {

			res.push(evaluate(scope, criterion, options));
		}, scope);

		return res;
	}


	function evaluateValueString(scope, criteria, options) {
		// [1] parse criteria
		criteria = parseArgumentsStr(criteria);

		return evaluate(scope, criteria, options);
	}


	module.exports = evaluateValueString;
});

/* jshint ignore:start */

/* jshint ignore:end */

define('__scope/evaluation/array',['require','exports','module','lodash'],function (require, exports, module) {
	


	var _ = require('lodash');
	/**
	 * Picks the properties defined by the array
	 * and returns them in an object hash.
	 *
	 * @method evaluateArrayToObject
	 * @param  {Object} scope
	 * @param  {Array} criteria
	 * @param  {Object} options
	 * @return {Object}
	 */
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

	/**
	 * Picks the properties defined in the criteria array
	 * and returns an array with the values in the required order.
	 *
	 * @method evaluateArrayToArray
	 * @param  {Object} scope
	 * @param  {Array} criteria
	 * @param  {Object} options
	 * @return {Array}
	 */
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


	/**
	 * The interface.
	 *
	 * @param  {[type]} scope    [description]
	 * @param  {[type]} criteria [description]
	 * @param  {[type]} options  [description]
	 * @return {[type]}          [description]
	 */
	module.exports = function evaluateArray(scope, criteria, options) {

		if (options && options.format === 'object') {

			// array -> object
			return evaluateArrayToObject(scope, criteria, options);

		} else {
			// array -> array
			return evaluateArrayToArray(scope, criteria, options);
		}
	}

});

/* jshint ignore:start */

/* jshint ignore:end */

define('__scope/evaluation/object',['require','exports','module','lodash'],function (require, exports, module) {
	


	var _ = require('lodash');

	/**
	 * Picks the properties defined on the criteria object
	 * from the scope and sets defaults.
	 *
	 * @method evaluateObject
	 * @param  {Object} scope
	 * @param  {Object} criteria
	 * @param  {Object} options
	 * @return {Object}
	 */
	module.exports = function evaluateObject(scope, criteria, options) {
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
	};

});

/* jshint ignore:start */

/* jshint ignore:end */

define('__scope/evaluation/regexp',['require','exports','module','lodash'],function (require, exports, module) {
	


	var _ = require('lodash');


	/**
	 * Loops through scope properties and picks
	 * those that match the regular expression criteria.
	 *
	 * @method evaluateRegExp
	 * @param  {Object} scope
	 * @param  {RegExp} criteria
	 * @param  {Object} options
	 * @return {Object}
	 */
	module.exports = function evaluateRegExp(scope, criteria, options) {
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
	};

});

/* jshint ignore:start */

/* jshint ignore:end */

define('__scope/evaluation/index',['require','exports','module','lodash','./string/index','./array','./object','./regexp'],function (require, exports, module) {
	


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

			// parse the string
			return evaluateString(this, criteria, options);

		} else {
			// otherwise, just return the value itself
			return criteria;
		}
	};

});

/* jshint ignore:start */

/* jshint ignore:end */

define('__scope/invocation',['require','exports','module','lodash'],function (require, exports, module) {
	


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
		if (_.isString(fn)) {
			fn = this[fn];

			if (!_.isFunction(fn)) {
				throw new Error('scope invoke error: fn ' + fn + ' not a function.');
			}
		}

		if (!_.isFunction(fn)) {
			throw new TypeError('scope invoke error: ' + fn + ' is not a function.');
		}

		// [1] get scopeArgs\
		var args = this.evaluate(scopeArgs);
		args = _.isArray(args) ? args : [args];

		// [2] invoke
		return fn.apply(this, args.concat(Array.prototype.slice.call(arguments, 2)));
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

		// scopeArgs defaults to empty array
		scopeArgs = scopeArgs || [];

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

		if (_.isObject(arguments[0])) {
			// arguments = [{ fnName: { fn: fn, args: scopeArgs }}]
			_.each(arguments[0], function (fnData, fnName) {

				this.fn(fnName, fnData.fn, fnData.args);

			}, this);

		} else {
			// arguments = [fnName, fn, scopeArgs]
			this[arguments[0]] = this.partial(arguments[1], arguments[2]);
		}

		return this;
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
;
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

		/**
		 * Assign initial data with descriptor.
		 * That's all. :)
		 *
		 * @method initialize
		 * @param  {Object} data       [description]
		 * @param  {Object} descriptor [description]
		 */
		initialize: function initializeScope(data, descriptor) {
			this.assign(data, descriptor);
		},

	}, nonEnum);

	// set to unwritable
	scope.proto({

		/**
		 * Creates a subscope that prototypically inherits from this object.
		 *
		 * @method create
		 * @param  {Object} data       [description]
		 * @param  {Object} descriptor [description]
		 * @return {Object}            [description]
		 */
		create: function create(data, descriptor) {

			// create the subscope
			var subscope = subject.assign(_.create(this), data, descriptor);

			// set reference to the parentScope (make it non enumerable)
			subject.assign(subscope, { parentScope: this }, nonEnum);

			return subscope;
		},

		/**
		 * Assigns values to the scope object.
		 *
		 * @method assign
		 * @param {Object|String} [data|key]
		 * @param {Object|*} [descriptor|value]
		 * @param {null|Object} [descriptor]
		 * @return {Object} [this]
		 */
		assign: function assign() {

			var data, descriptor;


			if (_.isString(arguments[0])) {
				// arguments = [key, value, descriptor]

				data       = ({})[arguments[0]] = arguments[1];
				descriptor = arguments[2];

			} else if (_.isObject(arguments[0])) {
				// arguments = [data, descriptor]

				data       = arguments[0];
				descriptor = arguments[1];
			}

			// assign using subject assign helper
			// as it accepts a descriptor object

			subject.assign(this, data, descriptor);

			return this;
		},

	}, nonEnumWrite);


	// proto
	scope
		// each, eachOwn
		.assignProto(require('./__scope/iteration'), nonEnumWrite)		// non evaluation, non writable
		// evaluate
		.assignProto(require('./__scope/evaluation/index'), nonEnum)	// non enumerable, but WRITABLE
		// invoke, partial, fn
		.assignProto(require('./__scope/invocation'), nonEnum);			// non enumerable, but WRITABLE
});

