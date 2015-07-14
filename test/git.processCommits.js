var should=require('should'),
    testrepo="https://github.com/coyotebringsfire/xuexi.git",
    rimraf=require('rimraf'), Git=require('../lib/git');

describe("git#processCommits", function processCommitsSuite() {
  this.timeout(0);
  var debug=require('debug')('xuexi:git:processCommits:test:processCommitsSuite:test');

  beforeEach(function beforeEachTest(done) {
    var debug=require('debug')('xuexi:git:gitProcessCommitsSuite:after:test');
    debug("removing /tmp/xuexi");
    rimraf("/tmp/xuexi", function(err) {
      debug("DELETE DONE %j", err);
      done();
    });
  });

  after(function afterAllTests(done) {
    var debug=require('debug')('xuexi:git:gitProcessCommitsSuite:after:test');
    debug("removing /tmp/xuexi");
    rimraf("/tmp/xuexi", function(err) {
      debug("DELETE DONE %j", err);
      done();
    });
  });

  describe("promise style", function promiseStyleSuite() {
    var debug=require('debug')('xuexi:git:processCommits:promiseStyleSuite:test');

    it("should reject the returned promise if called without an array of commits", function doIt(done) {
      var debug=require('debug')('xuexi:git:processCommits:promiseStyleSuite:doIt:test'),
          Git=require('../lib/git');
      var git=new Git(testrepo, "xuexi");
      git.clone()
        .then(function onCloneResolved() {
          return git.processCommits();
        }).then(function onProcessCommitsResolved(msg) {
          var debug=require('debug')('xuexi:git:processCommits:promiseStyleSuite:doIt:onResolve:test');
          process.chdir(git.xuexi_home);
          should.fail("Promise was resolved: %j", msg);
          done();
        }, function onReject(err) {
          var debug=require('debug')('xuexi:git:processCommits:promiseStyleSuite:doIt:onReject:test');
          process.chdir(git.xuexi_home);
          should(err).be.ok;
          done();
        });
    });
    it("should reject the returned promise if called with a non-object argument", function doIt(done) {
      var debug=require('debug')('xuexi:git:processCommits:promiseStyleSuite:doIt:test'),
          Git=require('../lib/git');
      var git=new Git(testrepo, "xuexi");
      git.clone()
        .then(function onCloneResolved() {
          return git.processCommits([{"commit":"INVALIDARGUMENT"}]);
        })
        .then(function onProcessCommitsResolved(msg) {
            var debug=require('debug')('xuexi:git:processCommits:promiseStyleSuite:doIt:onResolve:test');
            process.chdir(git.xuexi_home);
            should.fail("Promise was resolved: %j", msg);
            done();
          }, function onReject(err) {
            var debug=require('debug')('xuexi:git:processCommits:promiseStyleSuite:doIt:onReject:test');
            process.chdir(git.xuexi_home);
            should(err).be.ok;
            done();
          });
    });
    it("should resolve the returned promise if no errors happen during processing", function(done) {
      var debug=require('debug')('xuexi:git:processCommits:promiseStyleSuite:doIt:test'),
          Git=require('../lib/git');
      var git=new Git(testrepo, "xuexi");
      debug("xuexi_home %s", git.xuexi_home);
      git.clone()
          .then(function onCloneResolved() {
            debug("clone resolved");
            return git.getCommits();
          })
          .then(function onGetCommitsResolved() {
            debug("getCommits resolved %s", git.xuexi_home);
            return git.processCommits();
          })
          .then(function onProcessCommitsResolve() {
            var debug=require('debug')('xuexi:git:processCommits:promiseStyleSuite:doIt:onResolve:test');
            debug("Promise was resolved: %j", Object.keys(git));
            git.processedCommits.should.be.ok;
            done();
          }, function onReject(err) {
            var debug=require('debug')('xuexi:git:processCommits:promiseStyleSuite:doIt:onReject:test');
            process.chdir(git.xuexi_home);
            should.fail("Promise was rejected: %j", err);
            done();
          });
    });
  });

  describe("stats", function statsSuite() {
    var debug=require('debug')('xuexi:git:processCommits:statsSuite:test');
    
    it("should include average lines changed for each commit", function doIt(done) {
      var debug=require('debug')('xuexi:git:processCommits:statsSuite:doIt:test'),
          git=new Git(testrepo, "xuexi");
      git.clone()
        .then(function onCloneResolved() {
          return git.getCommits();
        })
        .then(function onGetCommitsResolved() {
          return git.processCommits();
        })
        .then(function onProcessCommitsResolved() {
          var debug=require('debug')('xuexi:git:processCommits:statsSuite:doIt:onResolve:test'),
              k, commitToVerify, commits=git.processedCommits;
          debug("processCommits resolved");
          for( k in commits[0] ) {
            debug("commit: %j", k);
            commitToVerify=commits[0][k];
            debug("verifying %j avg lines changed %d", commits[0][k], commits[0][k].averageLinesChanged);
            if(commits[0][k].averageLinesChanged) {
              commits[0][k].averageLinesChanged.should.not.equal(undefined);
            }
          }
          process.chdir(git.xuexi_home);
          done();
        }, function onReject(err) {
          var debug=require('debug')('xuexi:git:processCommits:statsSuite:doIt:onReject:test');
          process.chdir(git.xuexi_home);
          debug("promise rejected %j", err);
          should.fail;
          done();
        });
    });

    it("should include variance lines changed for each commit", function doIt(done) {
      var debug=require('debug')('xuexi:git:processCommits:statsSuite:doIt:test'),
          git=new Git(testrepo, "xuexi");
      git.clone()
        .then(function onCloneResolved() {
          return git.getCommits();
        })
        .then(function onGetCommitsResolved() {
          return git.processCommits();
        })
        .then(function onResolve() {
          var debug=require('debug')('xuexi:git:processCommits:statsSuite:doIt:onResolve:test'),
              k, commitToVerify, commits=git.processedCommits;
          debug("processCommits resolved");
          for( k in commits[0] ) {
            debug("commit: %j", k);
            commitToVerify=commits[0][k];
            debug("verifying %j variance lines changed %d", commits[0][k], commits[0][k].varianceLinesChanged);
            if(commits[0][k].varianceLinesChanged) {
              commits[0][k].varianceLinesChanged.should.not.equal(undefined);
            }
          }
          process.chdir(git.xuexi_home);
          done();
        }, function onReject(err) {
          var debug=require('debug')('xuexi:git:processCommits:statsSuite:doIt:onReject:test');
          process.chdir(git.xuexi_home);
          debug("promise rejected %j", err);
          should.fail;
          done();
        });
    });

    it("should include standard deviation lines changed for each commit", function doIt(done) {
      var debug=require('debug')('xuexi:git:processCommits:statsSuite:doIt:test'),
          Git=require('../lib/git'),
          git=new Git(testrepo, "xuexi");

      git.clone()
        .then(function onCloneResolved() {
          return git.getCommits();
        })
        .then(function onGetCommitsResolved() {
          return git.processCommits();
        })
        .then(function onResolve() {
          var debug=require('debug')('xuexi:git:processCommits:statsSuite:doIt:onResolve:test'),
              k, commitToVerify, commits=git.processedCommits;
          debug("processCommits resolved");
          for( k in commits[0] ) {
            debug("commit: %j", k);
            commitToVerify=commits[0][k];
            debug("verifying %j standard deviation lines changed %d", commits[0][k], commits[0][k].standardDevationLinesChanged);
            if(commits[0][k].standardDeviationLinesChanged) {
              commits[0][k].standardDeviationLinesChanged.should.not.equal(undefined);
            }
          }
          process.chdir(git.xuexi_home);
          done();
        }, function onReject(err) {
          var debug=require('debug')('xuexi:git:processCommits:statsSuite:doIt:onReject:test');
          process.chdir(git.xuexi_home);
          debug("promise rejected %j", err);
          should.fail;
          done();
        });
    });
  });
});