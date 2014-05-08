(function(name, factory) {

	var mod = typeof define !== 'function' ?
		// node
		'.././src' :
		// browser
		'scope',
		// dependencies for the test
		deps = [mod, 'should'];

	if (typeof define !== 'function') {
		// node
		factory.apply(null, deps.map(require));
	} else {
		// browser
		define(deps, factory);
	}

})('test', function(scope, should) {
	'use strict';

	describe('scope basics', function () {
		beforeEach(function () {


			var global = this.global = scope({

				place: 'earth',

				fruit: 'banana',
				color: 'yellow',

				data: {
					id: 'global'
				}

			});


			var global1 = this.global1 = scope({
				place: 'mars',


			})

			var local = this.local = global.create({
				fruit: 'watermelon',
				color: 'red',

				data: {
					id: 'local'
				}
			});

		});

		it('is fine (:', function () {

			this.global.fruit.should.eql('banana');
			this.global.color.should.eql('yellow');

			this.local.fruit.should.eql('watermelon');
			this.local.color.should.eql('red');
			this.local.place.should.eql('earth');

		});

		it('evaluates arrays of propnames into array of corresponding values', function () {

			this.global.evaluate(['color', 'fruit', 'data', 'place'])
				.should.eql([
					'yellow',
					'banana',
					{ id: 'global' },
					'earth',
				]);

			this.local.evaluate(['color', 'fruit', 'data', 'place'])
				.should.eql([
					'red',
					'watermelon',
					{ id: 'local' },
					'earth'
				]);
		});

		it('evaluates objects into objects', function () {

		});


		it('iterates throughout the scope', function () {

			var keys = [];

			this.local.each(function (value, key) {
				keys.push(key);
			});

			keys.length.should.eql(['place', 'fruit', 'color', 'data'])

		});
	});
});
