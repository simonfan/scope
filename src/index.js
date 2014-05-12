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
