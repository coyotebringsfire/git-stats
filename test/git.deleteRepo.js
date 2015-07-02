var should=require('should'),
    rimraf=require('rimraf'),
    debug=require('debug')('test:git:deleteRepo'),
    fs=require('fs-plus');

describe("#deleteRepo", function deleteRepoTestSuite() {
  var deleteRepo=require('../lib/git.deleteRepo');
  before(function preClean(done) {
    rimraf("/tmp/xuexi", function() {
      done();
    });
  });
  it("should reject the returned promise if called without a repo name", function doIt(done) {
    deleteRepo()
      .then(function onResolve() {
        should.fail("promise was resolved");
        done();
      }, function onReject(err) {
        var debug=require('debug')('test:git:deleteRepo:deleteRepoTestSuite:doIt:onReject');
        debug("%j", err);
        err.should.be.ok;
        debug("%s", err.message);
        err.message.should.match(/missing required repo name/);
        done();
      });
  });
  it("should reject the returned promise if called with an invalid repo", function doIt(done) {
    deleteRepo(["invalidrepo"])
      .then(function onResolve() {
        should.fail('promise was resolved');
        done();
      }, function onReject(err) {
        err.should.be.ok;
        err.message.should.match(/invalid repo/);
        done();
      });
  });
  it("should reject the returned promise if an error happens when deleting the repo", function doIt(done) {
    var repoDir="";
    if( process.cwd().match(/test$/) ) {
      repoDir="./testdir";
    } else {
      repoDir="./test/testdir";
    }
    fs.chmodSync(repoDir, 0100);
    
    deleteRepo(repoDir)
      .then(function onResolve() {
        should.fail('promise was resolved');
        done();
      }, function onReject(err) {
        debug("err:%j", err.code);
        err.should.be.ok;
        err.code.should.equal("EACCES");
        fs.existsSync(repoDir).should.be.ok;
        fs.chmodSync(repoDir, 0777);
        done();
      });
  });
  it("should delete the named repo and resolve the returned promise", function doIt(done) {
    var Git=require('../lib/git'), testrepo="https://github.com/coyotebringsfire/xuexi.git";
        git=new Git(testrepo), debug=require('debug')('test:git:deleteRepo:deleteRepoTestSuite:doIt');
    git.clone()
      .then(deleteRepo)
      .then(function onResolve() {
        fs.existsSync('/tmp/xuexi').should.not.be.ok;
        done();
      }, function onReject(err) {
        should.fail(new Error(err));
        done();
      });
  });
});