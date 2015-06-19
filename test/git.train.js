var should=require('should'),
	debug=require('debug')('xuexi:git:train:test'),
	fs=require('fs-plus'),
	nodegit=require('nodegit'),
	child_process=require('child_process'),
	async=require('async');

describe("git#train", function() {
	var testRepo="/Users/aumkara/workspace/MuMoo";

	describe("callback style", function() {
		it("should return an error if called without a repo", function(done) {
			var Git=require('../lib/git');
			Git.train({}, function trainCallback(err) {
				should(err).be.ok;
				done();
			});
		});
		it("should return an error if called with an invalid repo", function(done) {
			var INVALID_REPO="/invalidrepo";
			var Git=require('../lib/git');
			Git.train({repo:INVALID_REPO}, function trainCallback(err) {
				should(err).be.ok;
				done();
			});
		});	
	});

	describe("promise style", function() {
		var testRepo;

		it("should reject the returned promise if called without a repo", function(done) {
			var Git=require('../lib/git');
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
			var Git=require('../lib/git');
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
			var Git=require('../lib/git');
			testRepo="/Users/aumkara/workspace/MuMoo";
			//testRepo=__dirname+"/testrepo";
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

	describe("stats", function() {
		it("should include average lines changed", function(done) {
			var Git=require('../lib/git');
			//testRepo=__dirname+"/testrepo";
			Git.train({repo:testRepo})
				.then(function onResolve(trainedModel) {
					debug("Promise was resolved: %j", Object.keys(trainedModel[0]));
					trainedModel[0].should.be.ok;
					async.eachSeries(Object.keys(trainedModel[0]), function eachKey(key, nextKey) {
						debug("verifying %s %j", key, trainedModel[0][key]);
						trainedModel[0][key].averageLinesChanged.should.not.equal(undefined);
						nextKey();
					}, done);
				}, function onReject(err) {
					should.fail("Promise was rejected: %j", err);
					done();
				});
		});
		
		it("should include average lines added", function(done) {
			var Git=require('../lib/git');
			//testRepo=__dirname+"/testrepo";
			Git.train({repo:testRepo})
				.then(function onResolve(trainedModel) {
					debug("Promise was resolved: %j", Object.keys(trainedModel[0]));
					trainedModel[0].should.be.ok;
					async.eachSeries(Object.keys(trainedModel[0]), function eachKey(key, nextKey) {
						debug("verifying %s %j", key, trainedModel[0][key]);
						trainedModel[0][key].averageLinesAdded.should.not.equal(undefined);
						nextKey();
					}, done);
				}, function onReject(err) {
					should.fail("Promise was rejected: %j", err);
					done();
				});
		});
		it("should include average lines deleted", function(done) {
			var Git=require('../lib/git');
			//testRepo=__dirname+"/testrepo";
			Git.train({repo:testRepo})
				.then(function onResolve(trainedModel) {
					debug("Promise was resolved: %j", Object.keys(trainedModel[0]));
					trainedModel[0].should.be.ok;
					async.eachSeries(Object.keys(trainedModel[0]), function eachKey(key, nextKey) {
						debug("verifying %s %j", key, trainedModel[0][key]);
						trainedModel[0][key].averageLinesDeleted.should.not.equal(undefined);
						nextKey();
					}, done);
				}, function onReject(err) {
					should.fail("Promise was rejected: %j", err);
					done();
				});
		});

		it("should include variance lines changed", function(done) {
			var Git=require('../lib/git');
			//testRepo=__dirname+"/testrepo";
			Git.train({repo:testRepo})
				.then(function onResolve(trainedModel) {
					debug("Promise was resolved: %j", Object.keys(trainedModel[0]));
					trainedModel[0].should.be.ok;
					async.eachSeries(Object.keys(trainedModel[0]), function eachKey(key, nextKey) {
						debug("verifying %s %j", key, trainedModel[0][key]);
						trainedModel[0][key].varianceLinesChanged.should.not.equal(undefined);
						nextKey();
					}, done);
				}, function onReject(err) {
					should.fail("Promise was rejected: %j", err);
					done();
				});
		});
		
		it("should include variance lines added", function(done) {
			var Git=require('../lib/git');
			//testRepo=__dirname+"/testrepo";
			Git.train({repo:testRepo})
				.then(function onResolve(trainedModel) {
					debug("Promise was resolved: %j", Object.keys(trainedModel[0]));
					trainedModel[0].should.be.ok;
					async.eachSeries(Object.keys(trainedModel[0]), function eachKey(key, nextKey) {
						debug("verifying %s %j", key, trainedModel[0][key]);
						trainedModel[0][key].varianceLinesAdded.should.not.equal(undefined);
						nextKey();
					}, done);
				}, function onReject(err) {
					should.fail("Promise was rejected: %j", err);
					done();
				});
		});
		it("should include variance lines deleted", function(done) {
			var Git=require('../lib/git');
			//testRepo=__dirname+"/testrepo";
			Git.train({repo:testRepo})
				.then(function onResolve(trainedModel) {
					debug("Promise was resolved: %j", Object.keys(trainedModel[0]));
					trainedModel[0].should.be.ok;
					async.eachSeries(Object.keys(trainedModel[0]), function eachKey(key, nextKey) {
						debug("verifying %s %j", key, trainedModel[0][key]);
						trainedModel[0][key].varianceLinesDeleted.should.not.equal(undefined);
						nextKey();
					}, done);
				}, function onReject(err) {
					should.fail("Promise was rejected: %j", err);
					done();
				});
		});
		it("should include standard deviation lines changed", function(done) {
			var Git=require('../lib/git');
			//testRepo=__dirname+"/testrepo";
			Git.train({repo:testRepo})
				.then(function onResolve(trainedModel) {
					debug("Promise was resolved: %j", Object.keys(trainedModel[0]));
					trainedModel[0].should.be.ok;
					async.eachSeries(Object.keys(trainedModel[0]), function eachKey(key, nextKey) {
						debug("verifying %s %j", key, trainedModel[0][key]);
						trainedModel[0][key].standardDeviationLinesChanged.should.not.equal(undefined);
						nextKey();
					}, done);
				}, function onReject(err) {
					should.fail("Promise was rejected: %j", err);
					done();
				});
		});
		
		it("should include variance lines added", function(done) {
			var Git=require('../lib/git');
			//testRepo=__dirname+"/testrepo";
			Git.train({repo:testRepo})
				.then(function onResolve(trainedModel) {
					debug("Promise was resolved: %j", Object.keys(trainedModel[0]));
					trainedModel[0].should.be.ok;
					async.eachSeries(Object.keys(trainedModel[0]), function eachKey(key, nextKey) {
						debug("verifying %s %j", key, trainedModel[0][key]);
						trainedModel[0][key].standardDeviationLinesAdded.should.not.equal(undefined);
						nextKey();
					}, done);
				}, function onReject(err) {
					should.fail("Promise was rejected: %j", err);
					done();
				});
		});
		it("should include standard deviation lines deleted", function(done) {
			var Git=require('../lib/git');
			//testRepo=__dirname+"/testrepo";
			Git.train({repo:testRepo})
				.then(function onResolve(trainedModel) {
					debug("Promise was resolved: %j", Object.keys(trainedModel[0]));
					trainedModel[0].should.be.ok;
					async.eachSeries(Object.keys(trainedModel[0]), function eachKey(key, nextKey) {
						debug("verifying %s %j", key, trainedModel[0][key]);
						trainedModel[0][key].standardDeviationLinesDeleted.should.not.equal(undefined);
						nextKey();
					}, done);
				}, function onReject(err) {
					should.fail("Promise was rejected: %j", err);
					done();
				});
		});
	});
});