var should=require('should'),
	debug=require('debug')('git:getCommits:test'),
	Git=require('../lib/git');

describe("git#getCommits", function() {
	debug("git#getCommits");
	it("should return an error when the git repo is invalid", function(next) {
		debug("invalid repo");
		var INVALID_REPO="/invalidrepo",
			git=new Git({repo:INVALID_REPO});
		git.getCommits(function(err) {
			err.should.be.ok;
			debug("%s", err);
			next();
		});
	});
	it("should return the author for each commit", function(next) {
		debug("get author");
		var TEST_REPO="/Users/aumkara/workspace/MuMoo",
			git=new Git({repo:TEST_REPO});
		
		git.getCommits(function(err) {
			should(err).not.be.ok;
			debug("%d commits %j", git.commits.length, git.commits);
			git.commits.forEach( function eachCommit(commit) {
				should(commit.author).be.ok;
				should(commit.author.name).be.ok;
				should(commit.author.email).be.ok;
			});
			next();
		});
	});
	it("should return the date for each commit", function(next) {
		debug("get date");
		var TEST_REPO="/Users/aumkara/workspace/MuMoo",
			git=new Git({repo:TEST_REPO});
		
		git.getCommits(function(err) {
			should(err).not.be.ok;
			debug("%d commits %j", git.commits.length, git.commits);
			git.commits.forEach( function eachCommit(commit) {
				should(commit.date).be.ok;
			});
			next();
		});
	});
	it("should return the sha for each commit", function(next) {
		debug("get sha");
		var TEST_REPO="/Users/aumkara/workspace/MuMoo",
			git=new Git({repo:TEST_REPO});
		
		git.getCommits(function(err) {
			should(err).not.be.ok;
			debug("%d commits %j", git.commits.length, git.commits);
			git.commits.forEach( function eachCommit(commit) {
				should(commit.sha).be.ok;
			});
			next();
		});
	});
});