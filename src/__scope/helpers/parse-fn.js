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


	var _ = require('lodash');

		// captures the function name
	var nameRe = /^\s*function\s*([A-Za-z$_][A-Za-z0-9$_]*)?\s*\(/,
		// captures the argument names string
		argsRe = /^.*?\(\s*(.*?)\s*\)/;



	module.exports = function parseFn(fn) {

		var source = _.isString(fn) ? fn : fn.toString();

		// name
		var matchName = source.match(nameRe);

		// args
		var matchArgs = source.match(argsRe),
			argsString = matchArgs ? matchArgs[1] : void(0);

		return {
			name: matchName ? matchName[1] : void(0),
			args: argsString ? argsString.split(/,\s*/)
		};
	};
});
