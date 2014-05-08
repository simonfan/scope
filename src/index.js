//     scope
//     (c) simonfan
//     scope is licensed under the MIT terms.

/**
 * AMD and CJS module.
 *
 * @module scope
 */

/* jshint ignore:start */
if (typeof define !== 'function') { var define = require('amdefine')(module) }
/* jshint ignore:end */

define(function (require, exports, module) {
	'use strict';


	var _ = require('lodash'),
		subject = require('subject');

	var scope = module.exports = subject();





	var defaultDescriptor = {
	//	value:        void(0),
		configurable: false,
		writable:     true,
		enumerable:   false,
	};

	function extendNonEnum(obj, extensions, descriptor) {

		descriptor = descriptor || {};
		_.defaults(descriptor, defaultDescriptor);

		_.each(extensions, function (value, key) {

			Object.defineProperty(obj, key, _.extend({
				value: value,
			}, descriptor);

		});

		return obj;
	}



	// set the extend method of scope to be stealth setter
	scope.extend = function stealthExtend()


	function initializeScope(data) {

		// assign data to this object
		this.assign(data);
	}

	Object.defineProperty(scope.prototype, 'initialize', {
		value : initializeScope,
		writable : true,
		enumerable : false,
		configurable : false
	});


	scope.proto({

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
