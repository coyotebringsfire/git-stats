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

		before(function removeTestRepo(done) {
			//delete testrepo if it exists
			fs.remove(__dirname+"/testrepo", done);
		});

		before(function initGitRepo(done) {
			debug=require('debug')('git:test:git.train:before');	
			//create a new git repository
			fs.mkdirSync(__dirname+"/testrepo");
			debug("creating test repo %s", __dirname+"/testrepo");
			nodegit.Repository.init(__dirname+"/testrepo", 0)
				.then(function(_testRepo) {
					debug("repository created");
					testRepo=_testRepo;
					done();
				});
		});

		after(function(done) {
			debug=require('debug')('git:test:git.train:after');
			debug("removing testrepo");
			fs.removeSync(__dirname+"/testrepo");
			done();
		});

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
			//TODO make some commits to the test repo
			//TODO use shell commands to add and commit a file to the testrepo
			//testRepo="/Users/aumkara/workspace/MuMoo";
			testRepo=__dirname+"/testrepo";
			fs.writeFileSync(testRepo+"/test.json", JSON.stringify({}) );

			//cd testrepo && git add test.json && git commit -m "test commit" -a
			child_process.exec('cd testrepo && git add test.json && git commit -m "test commit" -a', function(err, stdout, stderr) {
				should(err).not.be.ok;
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
});