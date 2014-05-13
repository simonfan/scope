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

	describe('scope invocation', function () {
		beforeEach(function () {

			var global1 = this.global1 = scope({
				id: 'global1',
				v1: 'g11',
				v2: 'g12',
				v3: 'g13'
			});


			var global2 = this.global2 = scope({
				id: 'global2',
				v1: 'g21',
				v2: 'g22',
				v3: 'g23',
				v4: 'g24'
			});

			var local1 = this.local1 = global1.create({
				id: 'local1',
				v2: 'l12',
				v4: 'l14',
			});
		});

		it('invoke(fn, [arg1, arg2])', function () {

			function idPlusV1(id, v1) {
				return id + '-' + v1;
			}


			this.global1
				.invoke(idPlusV1, ['id', 'v1'])
				.should.eql('global1-g11');


			this.global2
				.invoke(idPlusV1, ['id', 'v1'])
				.should.eql('global2-g21')

			this.local1
				.invoke(idPlusV1, ['id', 'v1'])
				.should.eql('local1-g11');

		});

		it('invoke(fn, [arg1, arg2])', function () {

			function idPlusV1(id, v1) {
				return id + '-' + v1;
			}


			this.global1
				.invoke(idPlusV1, ['id', 'v1'])
				.should.eql('global1-g11');


			this.global2
				.invoke(idPlusV1, ['id', 'v1'])
				.should.eql('global2-g21')

			this.local1
				.invoke(idPlusV1, ['id', 'v1'])
				.should.eql('local1-g11');

		});

		it('invoke(fn, {arg1: df1, arg2: df2, arg3: df3})', function () {

			function idPlusV1(data) {
				return data.id + '-' + data.v1;
			}

			var requirements = {
				id: 'ID',
				v1: 'V1',
				v2: 'V2'
			};


			this.global1
				.invoke(idPlusV1, requirements)
				.should.eql('global1-g11');


			this.global2
				.invoke(idPlusV1, requirements)
				.should.eql('global2-g21')

			this.local1
				.invoke(idPlusV1, requirements)
				.should.eql('local1-g11');

		});


		it('fn(name, fn, [arg1, arg2, ...])', function () {

			var global2 = this.global2;

			function idPlusV4PlusV2(id, v4, v2, extraValue) {
				return Array.prototype.join.call(arguments, '-');
			}

			var requirements = ['id', 'v4', 'v2'];

			// define fn
			global2.fn('nonSenseString', idPlusV4PlusV2, requirements);

			// run the method
			global2.nonSenseString().should.eql('global2-g24-g22');

			// check that the defined method is a patialized one.
			global2.nonSenseString('more', 'non', 'sense').should.eql('global2-g24-g22-more-non-sense');
		});

		it('fn(name, fn, "arguments string")', function () {

			var local1 = this.local1;


			function joinStrings() {
				return Array.prototype.join.call(arguments, '-');
			}


			// define fn
			local1.fn('nonSenseString', joinStrings, '[ first, $v4, $v1 ]');

			// run the method
			local1.nonSenseString().should.eql('first-l14-g11');
			// with more arguments
			local1.nonSenseString('another', 'string').should.eql('first-l14-g11-another-string');

		})
	});
});
