var should=require('should'),
	Git=require('../lib/git');

describe("git library", function() {
	it("should throw an error when constructed without a git repo", function(next) {
		(function(){
			var git=new Git();
		}).should.throwError();
		next();
	});
	it("should throw an error when constructed with an undefined git repo", function(next) {
		(function(){
			var git=new Git({});
		}).should.throwError();
		next();
	});
	it("should connect to repo", function(next) {
		var repo="/Users/Aumkara/workspace/MuMoo";
		(function(){
			var git=new Git({repo:repo});
		}).should.not.throwError();
		next();
	});
});

describe("git#getStats", function() {
	it("should return an error when the git repo is invalid", function(next) {
		var INVALID_REPO="/invalidrepo",
			git=new Git({repo:INVALID_REPO});
		git.getStats(function(err) {
			err.should.be.ok;
			next();
		});
	});
});