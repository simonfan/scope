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

	describe('scope evaluation', function () {
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
			});

			var local1 = this.local1 = global1.create({
				id: 'local1',
				v2: 'l12',
				v4: 'l14',
			});
		});

		it('evaluate({ arg1: df1, arg2: df2, ... })', function () {

			this.global1.evaluate({
					id: undefined,
					v1: undefined,

					v4: 'df4',
				})
				.should.eql({
					id: 'global1',
					v1: 'g11',
					v4: 'df4'
				});
		});

		it("evaluate(/regexp/)", function () {

			this.local1.evaluate(/^v[23]/)
				.should.eql({
					v2: 'l12',
					v3: 'g13',
				});
		});
/*
		it("evaluate('object:prop1, prop2, prop3')", function () {
			this.local1.evaluate('object: id, v2, v4')
				.should.eql({
					id: 'local1',
					v2: 'l12',
					v4: 'l14'
				});
		});

		it("evaluate('array:v0, v1, v2, v3')", function () {
			this.local1.evaluate('array:  v4, id, v1')
				.should.eql([
					'l14', 'local1', 'l11'
				]);
		});
*/
	});
});