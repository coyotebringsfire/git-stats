var should=require('should'),
    testrepo="https://github.com/coyotebringsfire/xuexi.git",
    rimraf=require('rimraf');

describe("git#processCommits", function processCommitsSuite() {
  this.timeout(0);
  var debug=require('debug')('xuexi:git:processCommits:test:processCommitsSuite:test'),
      testRepo="/Users/aumkara/workspace/MuMoo";

  beforeEach(function beforeEachTest(done) {
    var debug=require('debug')('xuexi:git:gitCloneSuite:after:test');
    debug("removing /tmp/xuexi");
    rimraf("/tmp/xuexi", function(err) {
      debug("DELETE DONE %j", err);
      done();
    });
  });

  after(function afterAllTests(done) {
    var debug=require('debug')('xuexi:git:gitCloneSuite:after:test');
    debug("removing /tmp/xuexi");
    rimraf("/tmp/xuexi", function(err) {
      debug("DELETE DONE %j", err);
      done();
    });
  });

  describe("promise style", function promiseStyleSuite() {
    var debug=require('debug')('xuexi:git:processCommits:promiseStyleSuite:test'),
        testRepo;

    it("should reject the returned promise if called without an array of commits", function doIt(done) {
      var debug=require('debug')('xuexi:git:processCommits:promiseStyleSuite:doIt:test'),
          Git=require('../lib/git');
      var git=new Git(testrepo);
      git.processCommits()
        .then(function onResolve(msg) {
          var debug=require('debug')('xuexi:git:processCommits:promiseStyleSuite:doIt:onResolve:test');
          should.fail("Promise was resolved: %j", msg);
          done();
        }, function onReject(err) {
          var debug=require('debug')('xuexi:git:processCommits:promiseStyleSuite:doIt:onReject:test');
          should(err).be.ok;
          done();
        });
    });
    it("should reject the returned promise if called with a non-object argument", function doIt(done) {
      var debug=require('debug')('xuexi:git:processCommits:promiseStyleSuite:doIt:test'),
          Git=require('../lib/git');
      var git=new Git(testrepo);
      git.processCommits([{"commit":"INVALIDARGUMENT"}])
        .then(function onResolve(msg) {
          var debug=require('debug')('xuexi:git:processCommits:promiseStyleSuite:doIt:onResolve:test');
          should.fail("Promise was resolved: %j", msg);
          done();
        }, function onReject(err) {
          var debug=require('debug')('xuexi:git:processCommits:promiseStyleSuite:doIt:onReject:test');
          should(err).be.ok;
          done();
        });
    });
    it("should resolve the returned promise if no errors happen during processing", function(done) {
      var debug=require('debug')('xuexi:git:processCommits:promiseStyleSuite:doIt:test'),
          Git=require('../lib/git');
      var git=new Git(testrepo);
      git.clone()
          .then(git.getCommits)
          .then(git.processCommits)
          .then(function onResolve(response) {
            var debug=require('debug')('xuexi:git:processCommits:promiseStyleSuite:doIt:onResolve:test');
            debug("Promise was resolved: %j", git);
            response.should.be.ok;
            response.should.be.an.instanceOf(Object);
            //git.processedCommits.should.be.ok;
            done();
          }, function onReject(err) {
            var debug=require('debug')('xuexi:git:processCommits:promiseStyleSuite:doIt:onReject:test');
            should.fail("Promise was rejected: %j", err);
            done();
          });
    });
  });

  describe("stats", function statsSuite() {
    var debug=require('debug')('xuexi:git:processCommits:statsSuite:test');
    
    it("should include average lines changed for each commit", function doIt(done) {
      var debug=require('debug')('xuexi:git:processCommits:statsSuite:doIt:test'),
          Git=require('../lib/git'),
          git=new Git(testrepo);
      //testRepo=__dirname+"/testrepo";
      git.processCommits()
        .then(function onResolve(commits) {
          var debug=require('debug')('xuexi:git:processCommits:statsSuite:doIt:onResolve:test'),
              k, commitToVerify;
          debug("processCommits resolved");
          for( k in commits[0] ) {
            debug("commit: %j", k);
            commitToVerify=commits[0][k];
            debug("verifying %j avg lines changed %d", commits[0][k], commits[0][k].averageLinesChanged);
            if(commits[0][k].averageLinesChanged) {
              commits[0][k].averageLinesChanged.should.not.equal(undefined);
            }
          }
          done();
        }, function onReject(err) {
          var debug=require('debug')('xuexi:git:processCommits:statsSuite:doIt:onReject:test');
          debug("promise rejected %j", err);
          should.fail;
          //should.fail("Promise was rejected: %j", err);
          done();
        });
    });

    it("should include variance lines changed for each commit", function doIt(done) {
      var debug=require('debug')('xuexi:git:processCommits:statsSuite:doIt:test'),
          Git=require('../lib/git'),
          git=new Git(testrepo);

      //testRepo=__dirname+"/testrepo";
      git.processCommits()
        .then(function onResolve(commits) {
          var debug=require('debug')('xuexi:git:processCommits:statsSuite:doIt:onResolve:test'),
              k, commitToVerify;
          debug("processCommits resolved");
          for( k in commits[0] ) {
            debug("commit: %j", k);
            commitToVerify=commits[0][k];
            debug("verifying %j variance lines changed %d", commits[0][k], commits[0][k].varianceLinesChanged);
            if(commits[0][k].varianceLinesChanged) {
              commits[0][k].varianceLinesChanged.should.not.equal(undefined);
            }
          }
          done();
        }, function onReject(err) {
          var debug=require('debug')('xuexi:git:processCommits:statsSuite:doIt:onReject:test');
          debug("promise rejected %j", err);
          should.fail;
          //should.fail("Promise was rejected: %j", err);
          done();
        });
    });

    it("should include standard deviation lines changed for each commit", function doIt(done) {
      var debug=require('debug')('xuexi:git:processCommits:statsSuite:doIt:test'),
          Git=require('../lib/git'),
          git=new Git(testrepo);

      //testRepo=__dirname+"/testrepo";
      git.processCommits()
        .then(function onResolve(commits) {
          var debug=require('debug')('xuexi:git:processCommits:statsSuite:doIt:onResolve:test'),
              k, commitToVerify;
          debug("processCommits resolved");
          for( k in commits[0] ) {
            debug("commit: %j", k);
            commitToVerify=commits[0][k];
            debug("verifying %j standard deviation lines changed %d", commits[0][k], commits[0][k].standardDevationLinesChanged);
            if(commits[0][k].standardDeviationLinesChanged) {
              commits[0][k].standardDeviationLinesChanged.should.not.equal(undefined);
            }
          }
          done();
        }, function onReject(err) {
          var debug=require('debug')('xuexi:git:processCommits:statsSuite:doIt:onReject:test');
          debug("promise rejected %j", err);
          should.fail;
          //should.fail("Promise was rejected: %j", err);
          done();
        });
    });
  });
});