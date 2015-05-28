var should=require('should'),
	debug=require('debug')('git:test'),
	Git=require('../lib/git');

describe("git library", function() {
	debug("git library");
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
