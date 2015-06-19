var should=require('should'),
	debug=require('debug')('xuexi:git:test'),
	Git=require('../lib/git');

describe("git library", function() {
	it("should have train and predict methods", function(done) {
		Git.train.should.be.type('function');
		Git.predict.should.be.type('function');
		done();
	});
});
