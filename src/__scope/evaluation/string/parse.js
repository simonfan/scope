/* jshint ignore:start */
if (typeof define !== 'function') { var define = require('amdefine')(module) }
/* jshint ignore:end */

define(function (require, exports, module) {
	'use strict';

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
			res.type  = 'evaluated';
			res.value = match[2];


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
	};

	/**
	 * The string that will match out the type and effective value.
	 *
	 * @property valueMatcherString
	 * @type RegExp
	 */
	var whitespace = '\\s*',
		literal    = '(\\w+)',
		evaluated  = '\\$(\\w+)',
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

	/**
	 * (\w+) LITERAL
	 * \$(\W+) EVALUATED
	 * \[\s*(.*?)\s*\] ARRAY
	 * \{\s*(.*?)\s*\} OBJECT
	 */
	// sample arguments string: "literal, $evaluated, {$arg3, key: $arg4}"
	var valueMatcher = new RegExp(valueMatcherString);
	function parseValueString(str) {
		var res = {},
			match = str.match(valueMatcher);

		return evaluateValueMatch(match);
	};


	/**
	 *
	 * @property objectValueMatcherString
	 * @type {String}
	 */
	var objectValueMatcherString = [
		whitespace + '(?:',
			evaluated + whitespace + '(?:,|$)|',
			'(?:',
				literal,
				':' + whitespace,
				'(.*?)' + whitespace + '(?:,(?!.*?})|$)',
			')',
		')'
	].join('');

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
					type: 'evaluated',
					value: objectValueMatch[1]
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
