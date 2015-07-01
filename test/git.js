var should=require('should'),
	debug=require('debug')('xuexi:git:test'),
	Git=require('../lib/git');

describe("git library", function() {
	it("should have train method", function(done) {
    var git=new Git("");
		git.train.should.be.type('function');
		done();
	});
  it("should have getCommits method", function(done) {
    var git=new Git("");
    git.getCommits.should.be.type('function');
    done();
  });
  it("should have processCommits method", function(done) {
    var git=new Git("");
    git.processCommits.should.be.type('function');
    done();
  });
  it("should have predict method", function(done) {
    var git=new Git("");
    git.predict.should.be.type('function');
    done();
  });
});
