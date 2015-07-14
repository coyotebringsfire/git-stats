var should=require('should'),
	debug=require('debug')('xuexi:git:test'),
	Git=require('../lib/git');

describe("git library", function() {
  it("should have clone method", function(done) {
    var git=new Git("");
    git.clone.should.be.type('function');
    done();
  });
	it("should not have train method", function(done) {
    var git=new Git("");
		should(git.train).not.be.type('function');
		done();
	});
  it("should not have getCommits method", function(done) {
    var git=new Git("");
    should(git.getCommits).not.be.type('function');
    done();
  });
  it("should not have processCommits method", function(done) {
    var git=new Git("");
    should(git.processCommits).not.be.type('function');
    done();
  });
  it("should not have predict method", function(done) {
    var git=new Git("");
    should(git.predict).not.be.type('function');
    done();
  });
});
