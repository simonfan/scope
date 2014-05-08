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

define('__scope/evaluation',['require','exports','module','lodash'],function (require, exports, module) {
	


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




	/// pick

	exports.pick = function pick(fn, context) {


		if (_.isArray(fn)) {
			// array picker
			return this.evaluate(fn);
		} else {
			// filter

			var res = {};

			this.each(function (value, key) {

				if (fn.call(context, value, key)) {
					res[key] = value;
				}

			});

			return res;
		}
	};

	exports.pickOwn = function pickOwn(fn, context) {
		return _.pick(this, fn, context);
	}
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

define('scope',['require','exports','module','lodash','subject','./__scope/evaluation','./__scope/iteration'],function (require, exports, module) {
	


	var _ = require('lodash'),
		subject = require('subject');

	var scope = module.exports = subject({

		initialize: function initializeScope(data) {

			// unset initialize
			this.initialize = void(0);

			// assign data to this object
			this.assign(data);
		},

		create: function create(data) {
			return _.extend(_.create(this), data, { parentScope: this });
		},

		invoke: function invoke(fn, args, context) {

			// [0] default context
			context = context || this;

			fn = _.isFunction(fn) ? fn : this[fn];

			// [1] evaluate args
			args = this.evaluate(args);

			// [2] invoke
			return _.isArray(args) ? fn.apply(context, args) : fn.call(context, args);
		},

		assign: function assign(key, value) {
			if (_.isString(key)) {
				this[key] = value;
			} else if (_.isObject(key)) {
				_.assign(this, key);
			}

			return this;
		},
	});


	// proto
	scope
		.proto(require('./__scope/evaluation'))
		.proto(require('./__scope/iteration'));
});

