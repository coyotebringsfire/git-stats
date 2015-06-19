var should=require('should'),
	git_clone=require('../lib/git.clone'),
	testrepo="https://github.com/coyotebringsfire/xuexi.git",
	debug=require('debug')('git:test'),
	fs=require('fs-plus');

describe("git_clone", function gitCloneSuite() {
	this.timeout(0);
	var debug=require('debug')('git:test:gitCloneSuite');

	beforeEach(function beforeEachTest(done) {
		var debug=require('debug')('git:test:gitCloneSuite:after');
		debug("removing /tmp/xuexi");
		try {
			debug("removing /tmp/xuexi");
			fs.removeSync("/tmp/xuexi");
		} catch(e) {
			debug("error removing /tmp/xuexi %j", e);
		}
		done();
	});

	after(function afterAllTests(done) {
		var debug=require('debug')('git:test:gitCloneSuite:after');
		debug("removing /tmp/xuexi");
		try {
			debug("removing /tmp/xuexi");
			fs.removeSync("/tmp/xuexi");
		} catch(e) {
			debug("error removing /tmp/xuexi %j", e);
		}
		done();
	});

	it("should reject the returned promise if no repo url is given", function doIt(done) {
		var debug=require('debug')('git:test:gitCloneSuite:doIt');
		debug('doing it');
		git_clone()
			.then(function onResolve(res) {
				var debug=require('debug')('git:test:gitCloneSuite:doIt:onResolve');
				should.fail("promise resolved");
				debug('resolved');
				done();
			}, function onReject(err) {
				var debug=require('debug')('git:test:gitCloneSuite:doIt:onReject');
				debug('rejected');
				done();
			});
	});
	it("should use default options if none are given", function doIt(done) {
		var debug=require('debug')('git:test:gitCloneSuite:doIt');
		git_clone(testrepo)
			.then(function onResolve(res) {
				var debug=require('debug')('git:test:gitCloneSuite:doIt:onResolve');
				debug("res %j", res);
				res.should.be.ok;
				res.results.should.match(/OK/);
				// verify default options were set
				res.options.should.eql({
					targetDirectory:"/tmp/"
				});
				done();
			}, function onReject(err) {
				var debug=require('debug')('git:test:gitCloneSuite:doIt:onResolve');
				should.fail("promise rejected");
			});
	});
	it("should override default options with given options", function doIt(done) {
		var debug=require('debug')('git:test:gitCloneSuite:doIt');
		git_clone(testrepo, { testOption:"TEST" })
			.then(function onResolve(res) {
				var debug=require('debug')('git:test:gitCloneSuite:doIt:onResolve');
				debug("res %j", res);
				res.should.be.ok;
				res.results.should.match(/OK/);
				// verify options are merged with defaults
				res.options.should.eql({
					targetDirectory:"/tmp/",
					testOption:"TEST"
				});
				done();
			}, function onReject(err) {
				var debug=require('debug')('git:test:gitCloneSuite:doIt:onResolve');
				should.fail("promise rejected");
			});
	});
	it("should resolve the returned promise if no error happens", function doIt(done) {
		var debug=require('debug')('git:test:gitCloneSuite:doIt');
		git_clone(testrepo)
			.then(function onResolve(res) {
				var debug=require('debug')('git:test:gitCloneSuite:doIt:onResolve');
				debug("res %j", res);
				res.should.be.ok;
				res.results.should.match(/OK/);
				done();
			}, function onReject(err) {
				var debug=require('debug')('git:test:gitCloneSuite:doIt:onResolve');
				should.fail("promise rejected");
			});
	});
});