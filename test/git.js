var should=require('should'),
	debug=require('debug')('xuexi:git:test'),
	Git=require('../lib/git');

describe("git library", function() {
	it("should have train method", function(done) {
		Git.train.should.be.type('function');
		done();
	});
  it("should have getCommits method", function(done) {
    Git.getCommits.should.be.type('function');
    done();
  });
  it("should have processCommits method", function(done) {
    Git.processCommits.should.be.type('function');
    done();
  });
  it("should have predict method", function(done) {
    Git.predict.should.be.type('function');
    done();
  });
});
