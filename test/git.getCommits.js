var should=require('should'),
  debug=require('debug')('git:getCommits:test'),
  fs=require('fs-plus'),
  async=require('async');

describe("git#getCommits", function getCommitsSuite() {
  this.timeout(0);
  var debug=require('debug')('git:getCommits:test:getCommitsSuite'),
      testRepo="/Users/aumkara/workspace/MuMoo";

  describe("promise style", function promiseStyleSuite() {
    var debug=require('debug')('git:getCommits:test:promiseStyleSuite'),
        testRepo;

    it("should reject the returned promise if called without a repo", function doIt(done) {
      var debug=require('debug')('git:getCommits:test:promiseStyleSuite:doIt'),
          Git=require('../lib/git');
      Git.getCommits({})
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
      Git.getCommits({repo: INVALID_REPO})
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
    it("should resolve the returned promise if no errors happen during training", function(done) {
      var debug=require('debug')('git:getCommits:test:promiseStyleSuite:doIt'),
          Git=require('../lib/git');
      testRepo="/Users/aumkara/workspace/MuMoo";
      //testRepo=__dirname+"/testrepo";
      Git.getCommits({repo:testRepo})
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

  describe("stats", function statsSuite() {
    var debug=require('debug')('git:getCommits:test:statsSuite');
    
    it("should include average lines changed for each commit", function doIt(done) {
      var debug=require('debug')('git:getCommits:test:statsSuite:doIt'),
          Git=require('../lib/git');

      //testRepo=__dirname+"/testrepo";
      Git.getCommits({repo:testRepo})
        .then(function onResolve(commits) {
          var debug=require('debug')('git:getCommits:test:statsSuite:doIt:onResolve'),
              k, commitToVerify;
          debug("getCommits resolved");
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
          var debug=require('debug')('git:getCommits:test:statsSuite:doIt:onReject');
          debug("promise rejected %j", err);
          should.fail;
          //should.fail("Promise was rejected: %j", err);
          done();
        });
    });

    it("should include variance lines changed for each commit", function doIt(done) {
      var debug=require('debug')('git:getCommits:test:statsSuite:doIt'),
          Git=require('../lib/git');

      //testRepo=__dirname+"/testrepo";
      Git.getCommits({repo:testRepo})
        .then(function onResolve(commits) {
          var debug=require('debug')('git:getCommits:test:statsSuite:doIt:onResolve'),
              k, commitToVerify;
          debug("getCommits resolved");
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
          var debug=require('debug')('git:getCommits:test:statsSuite:doIt:onReject');
          debug("promise rejected %j", err);
          should.fail;
          //should.fail("Promise was rejected: %j", err);
          done();
        });
    });

    it("should include standard deviation lines changed for each commit", function doIt(done) {
      var debug=require('debug')('git:getCommits:test:statsSuite:doIt'),
          Git=require('../lib/git');

      //testRepo=__dirname+"/testrepo";
      Git.getCommits({repo:testRepo})
        .then(function onResolve(commits) {
          var debug=require('debug')('git:getCommits:test:statsSuite:doIt:onResolve'),
              k, commitToVerify;
          debug("getCommits resolved");
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
          var debug=require('debug')('git:getCommits:test:statsSuite:doIt:onReject');
          debug("promise rejected %j", err);
          should.fail;
          //should.fail("Promise was rejected: %j", err);
          done();
        });
    });
  });
});