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
