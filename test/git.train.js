var should=require('should'),
	debug=require('debug')('git:train:test'),
	Git=require('../lib/git'),
	fs=require('fs-plus'),
	nodegit=require('nodegit'),
	child_process=require('child_process');

describe("git#train", function() {
	var testRepo=undefined;

	describe("callback style", function() {
		it("should return an error if called without a repo", function(done) {
			Git.train({}, function trainCallback(err) {
				should(err).be.ok;
				done();
			});
		});
		it("should return an error if called with an invalid repo", function(done) {
			var INVALID_REPO="/invalidrepo";
			Git.train({repo:INVALID_REPO}, function trainCallback(err) {
				should(err).be.ok;
				done();
			});
		});	
	});

	describe("promise style", function() {
		var testRepo;

		it("should reject the returned promise if called without a repo", function(done) {
			Git.train({})
				.then(function onResolve(msg) {
					should.fail("Promise was resolved: %j", msg);
					done();
				}, function onReject(err) {
					err.should.be.ok;
					debug("reject error: %j", err);
					done();
				});
		});
		it("should reject the returned promise if called with an invalid repo", function(done) {
			var INVALID_REPO="/invalidrepo";
			Git.train({repo: INVALID_REPO})
				.then(function onResolve(msg) {
					should.fail("Promise was resolved: %j", msg);
					done();
				}, function onReject(err) {
					err.should.be.ok;
					debug("reject error: %j", err);
					done();
				});
		});
		it("should resolve the returned promise if no errors happen during training", function(done) {
			//testRepo="/Users/aumkara/workspace/MuMoo";
			testRepo=__dirname+"/testrepo";
			Git.train({repo:testRepo})
				.then(function onResolve(trainedModel) {
					debug("Promise was resolved: %j", trainedModel);
					trainedModel.should.be.ok;
					done();
				}, function onReject(err) {
					should.fail("Promise was rejected: %j", err);
					done();
				});
		});
	});
});