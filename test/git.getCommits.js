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

    it("should resolve the returned promise if no errors happen while getting commits", function(done) {
      var debug=require('debug')('xuexi:git:getCommits:promiseStyleSuite:doIt:test'),
          Git=require('../lib/git');
      //testRepo="/Users/aumkara/workspace/MuMoo";
      testRepo="https://github.com/coyotebringsfire/xuexi";
      debug("cloning repo %s", testrepo);
      git=new Git(testrepo, "xuexi");
      git.clone()
        .then(function onCloneResolved() {
          return git.getCommits();
        })
        .then(function onResolve(trainedModel) {
          var debug=require('debug')('xuexi:git:getCommits:promiseStyleSuite:doIt:onResolve:test');
          process.chdir(git.xuexi_home);
          debug("Promise was resolved: %j", trainedModel);
          trainedModel.should.be.ok;
          git.commits.should.be.ok;
          git.processCommits.should.be.type('function');
          done();
        }, function onReject(err) {
          var debug=require('debug')('xuexi:git:getCommits:promiseStyleSuite:doIt:onReject:test');
          process.chdir(git.xuexi_home);
          should.fail("Promise was rejected: %j", err);
          done();
        });
    });
  });
});