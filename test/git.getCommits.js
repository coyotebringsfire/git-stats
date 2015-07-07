var should=require('should'),
    testrepo="https://github.com/coyotebringsfire/xuexi.git",
    debug=require('debug')('xuexi:git:getCommits:test'),
    fs=require('fs-plus'),
    async=require('async'),
    rimraf=require('rimraf');

describe("git#getCommits", function getCommitsSuite() {
  this.timeout(0);
  var debug=require('debug')('xuexi:git:getCommits:getCommitsSuite:test'),
      testRepo="/Users/aumkara/workspace/MuMoo";

  beforeEach(function beforeEachTest(done) {
    var debug=require('debug')('xuexi:git:gitCloneSuite:after:test');
    debug("removing /tmp/xuexi");
    rimraf("/tmp/xuexi", function() {
      done();
    });
  });

  after(function afterAllTests(done) {
    var debug=require('debug')('xuexi:git:gitCloneSuite:after:test');
    debug("removing /tmp/xuexi");
    rimraf("/tmp/xuexi", function() {
      done();
    });
  });

  describe("promise style", function promiseStyleSuite() {
    var debug=require('debug')('xuexi:git:getCommits:promiseStyleSuite:test'),
        testRepo;

    it("should reject the returned promise if called without a repo", function doIt(done) {
      var debug=require('debug')('xuexi:git:getCommits:promiseStyleSuite:doIt:test'),
          Git=require('../lib/git');
      git=new Git(testrepo);
      git.getCommits()
        .then(function onResolve(msg) {
          var debug=require('debug')('xuexi:git:getCommits:promiseStyleSuite:doIt:onResolve:test');
          should.fail("Promise was resolved: %j", msg);
          done();
        }, function onReject(err) {
          var debug=require('debug')('git:getCommits:promiseStyleSuite:doIt:onReject:test');
          err.should.be.ok;
          debug("reject error: %j", err);
          done();
        });
    });
    it("should reject the returned promise if called with an invalid repo", function doIt(done) {
      var debug=require('debug')('xuexi:git:getCommits:promiseStyleSuite:doIt:test'),
          INVALID_REPO="/invalidrepo",
          Git=require('../lib/git');
      git=new Git(testrepo);
      git.getCommits()
        .then(function onResolve(msg) {
          var debug=require('debug')('xuexi:git:getCommits:promiseStyleSuite:doIt:onResolve:test');
          should.fail("Promise was resolved: %j", msg);
          debug("promise was resolved %j", msg);
          done();
        }, function onReject(err) {
          var debug=require('debug')('xuexi:git:getCommits:promiseStyleSuite:doIt:onReject:test');
          err.should.be.ok;
          err.message.should.match(/missing required repo dir/);
          debug("reject error: %s", err.message);
          done();
        });
    });
    it("should resolve the returned promise if no errors happen while getting commits", function(done) {
      var debug=require('debug')('xuexi:git:getCommits:promiseStyleSuite:doIt:test'),
          Git=require('../lib/git');
      //testRepo="/Users/aumkara/workspace/MuMoo";
      debug("cloning repo %s", testrepo);
      git=new Git(testrepo);
      git.clone()
        .then(git.getCommits)
        .then(function onResolve(trainedModel) {
          var debug=require('debug')('xuexi:git:getCommits:promiseStyleSuite:doIt:onResolve:test');
          debug("Promise was resolved: %j", trainedModel);
          trainedModel.should.be.ok;
          done();
        }, function onReject(err) {
          var debug=require('debug')('xuexi:git:getCommits:promiseStyleSuite:doIt:onReject:test');
          should.fail("Promise was rejected: %j", err);
          done();
        });
    });
  });
});