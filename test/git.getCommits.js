var should=require('should'),
    testrepo="https://github.com/coyotebringsfire/xuexi.git",
    debug=require('debug')('git:getCommits:test'),
    fs=require('fs-plus'),
    async=require('async');

describe("git#getCommits", function getCommitsSuite() {
  this.timeout(0);
  var debug=require('debug')('xuexi:git:test:getCommits:getCommitsSuite'),
      testRepo="/Users/aumkara/workspace/MuMoo";

  beforeEach(function beforeEachTest(done) {
    var debug=require('debug')('xuexi:git:test:gitCloneSuite:after');
    debug("removing /tmp/xuexi.git");
    try {
      debug("removing /tmp/xuexi.git");
      fs.removeSync("/tmp/xuexi.git");
    } catch(e) {
      debug("error removing /tmp/xuexi.git %j", e);
    }
    done();
  });

  after(function afterAllTests(done) {
    var debug=require('debug')('xuexi:git:test:gitCloneSuite:after');
    debug("removing /tmp/xuexi.git");
    try {
      debug("removing /tmp/xuexi.git");
      fs.removeSync("/tmp/xuexi.git");
    } catch(e) {
      debug("error removing /tmp/xuexi.git %j", e);
    }
    done();
  });

  describe("promise style", function promiseStyleSuite() {
    var debug=require('debug')('git:getCommits:test:promiseStyleSuite'),
        testRepo;

    it("should reject the returned promise if called without a repo", function doIt(done) {
      var debug=require('debug')('git:getCommits:test:promiseStyleSuite:doIt'),
          Git=require('../lib/git');
      git=new Git(testrepo);
      git.getCommits()
        .then(function onResolve(msg) {
          var debug=require('debug')('git:getCommits:test:promiseStyleSuite:doIt:onResolve');
          should.fail("Promise was resolved: %j", msg);
          done();
        }, function onReject(err) {
          var debug=require('debug')('git:getCommits:test:promiseStyleSuite:doIt:onReject');
          err.should.be.ok;
          debug("reject error: %j", err);
          done();
        });
    });
    it("should reject the returned promise if called with an invalid repo", function doIt(done) {
      var debug=require('debug')('git:getCommits:test:promiseStyleSuite:doIt'),
          INVALID_REPO="/invalidrepo",
          Git=require('../lib/git');
      git=new Git(testrepo);
      git.getCommits()
        .then(function onResolve(msg) {
          var debug=require('debug')('git:getCommits:test:promiseStyleSuite:doIt:onResolve');
          should.fail("Promise was resolved: %j", msg);
          debug("promise was resolved %j", msg);
          done();
        }, function onReject(err) {
          var debug=require('debug')('git:getCommits:test:promiseStyleSuite:doIt:onReject');
          err.should.be.ok;
          err.message.should.match(/missing required repo dir/);
          debug("reject error: %s", err.message);
          done();
        });
    });
    it("should resolve the returned promise if no errors happen during training", function(done) {
      var debug=require('debug')('git:getCommits:test:promiseStyleSuite:doIt'),
          Git=require('../lib/git');
      //testRepo="/Users/aumkara/workspace/MuMoo";
      git=new Git(testrepo);
      git.clone()
        .then(git.getCommits)
        .then(function onResolve(trainedModel) {
          var debug=require('debug')('git:getCommits:test:promiseStyleSuite:doIt:onResolve');
          debug("Promise was resolved: %j", trainedModel);
          trainedModel.should.be.ok;
          done();
        }, function onReject(err) {
          var debug=require('debug')('git:getCommits:test:promiseStyleSuite:doIt:onReject');
          should.fail("Promise was rejected: %j", err);
          done();
        });
    });
  });
});