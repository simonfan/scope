define(function (require, exports, module) {
	'use strict';

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
