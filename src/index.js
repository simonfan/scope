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


	var scope = {

		create: function create(data) {
			return _.extend(_.create(this), data);
		},

		evaluate: function evaluate(data) {
			if (_.isArray(data)) {
				// data = ['prop1', 'prop2', ...]
				return _.map(data, function (propName) {
					return this[propName];
				}, this);
			} else if (_.isObject(data)) {
				// data = { prop1: 'default-prop1-value', prop2: 'default-prop2-value', ... }
				return _.mapValues(data, function (defaultValue, propName) {
					return this[propName] || defaultValue;
				}, this);
			} else if (_.isString(data)) {
				// data = 'prop1'
				return this[data];
			}
		},

		invoke: function invoke(fn, args, context) {

			// [0] default context
			context = context || this;

			fn = _.isFunction(fn) ? fn : this.evaluate(fn);

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
	};

	module.exports = _.bind(scope.create, scope);
});
