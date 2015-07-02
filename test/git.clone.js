var should=require('should'),
	git_clone=require('../lib/git.clone'),
	testrepo="https://github.com/coyotebringsfire/xuexi.git",
	debug=require('debug')('xuexi:git:test'),
	fs=require('fs-plus'),
	Git=require('../lib/git'),
  rimraf=require('rimraf');

describe("git_clone", function gitCloneSuite() {
	this.timeout(0);
	var debug=require('debug')('xuexi:git:gitCloneSuite:test');

	beforeEach(function beforeEachTest(done) {
		var debug=require('debug')('xuexi:git:gitCloneSuite:after:test');
		debug("removing /tmp/xuexi.git");
		rimraf("/tmp/xuexi", function() {
			done();
		});
	});

	after(function afterAllTests(done) {
		var debug=require('debug')('xuexi:git:gitCloneSuite:after:test');
		debug("removing /tmp/xuexi.git");
		rimraf("/tmp/xuexi", function() {
			done();
		});
	});

	it("should throw an exception if no repo url is given", function doIt(done) {
		var debug=require('debug')('xuexi:git:gitCloneSuite:doIt:test');
		debug('doing it');
		(function () { var git=new Git(); }).should.throw();
		done();
	});
	it("should use default options if none are given", function doIt(done) {
		var debug=require('debug')('xuexi:git:gitCloneSuite:doIt:test');
		var git=new Git(testrepo);
		git.clone()
			.then(function onResolve(res) {
				var debug=require('debug')('xuexi:git:gitCloneSuite:doIt:onResolve:test');
				debug("res %j", res);
				//res.should.be.ok;
				//res.results.should.match(/OK/);
				// verify default options were set
				//res.options.should.eql({
				//	targetDirectory:"/tmp/"
				//});
				res.should.match(/^\/tmp\//);
				debug("done");
				done();
			}, function onReject(err) {
				var debug=require('debug')('xuexi:git:gitCloneSuite:doIt:onResolve:test');
				should.fail("promise rejected");
			});
	});
	it("should override default options with given options", function doIt(done) {
		var debug=require('debug')('xuexi:git:gitCloneSuite:doIt:test');
		var git=new Git(testrepo);
		rimraf("/var/tmp/xuexi", function() {
			git.clone({ targetDirectory:"/var/tmp" })
				.then(function onResolve(res) {
					var debug=require('debug')('xuexi:git:gitCloneSuite:doIt:onResolve:test');
					debug("res %j", res.options);
					res.should.be.ok;
					res.should.match(/^\/var\/tmp\//);
					debug("removing /var/tmp/xuexi");
					rimraf("/var/tmp/xuexi.git", function() {
						done();
					});
				}, function onReject(err) {
					var debug=require('debug')('xuexi:git:gitCloneSuite:doIt:onResolve:test');
					should.fail("promise rejected");
				});
		});
	});
	it("should resolve the returned promise if no error happens", function doIt(done) {
		var debug=require('debug')('xuexi:git:gitCloneSuite:doIt:test');
		var git=new Git(testrepo);
		git.clone()
			.then(function onResolve(res) {
				var debug=require('debug')('xuexi:git:gitCloneSuite:doIt:onResolve:test');
				debug("res %j", res);
				res.should.be.ok;
				res.should.match(/^\/tmp\//);
				done();
			}, function onReject(err) {
				var debug=require('debug')('xuexi:git:gitCloneSuite:doIt:onResolve:test');
				should.fail("promise rejected");
			});
	});
	it("should insert a gitDir property on the calling object", function doIt(done) {
		var debug=require('debug')('xuexi:git:gitCloneSuite:doIt:test');
		var git=new Git(testrepo);
		git.clone()
			.then(function onResolve(res) {
				var debug=require('debug')('xuexi:git:gitCloneSuite:doIt:onResolve:test');
				debug("gitDir %j", git.gitDir);
				git.gitDir.should.match(/\/tmp\/xuexi/);
				done();
			}, function onReject(err) {
				var debug=require('debug')('xuexi:git:gitCloneSuite:doIt:onResolve:test');
				should.fail("promise rejected");
			});
	});
});