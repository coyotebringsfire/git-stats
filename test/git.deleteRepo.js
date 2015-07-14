var should=require('should'),
    rimraf=require('rimraf'),
    debug=require('debug')('test:git:deleteRepo'),
    fs=require('fs-plus'),
    Git=require('../lib/git'),
    testrepo="https://github.com/coyotebringsfire/xuexi";

describe("#deleteRepo", function deleteRepoTestSuite() {
  //var deleteRepo=require('../lib/git.deleteRepo');
  before(function preClean(done) {
    rimraf("/tmp/xuexi", function() {
      done();
    });
  });
  it("should reject the returned promise if an error happens when deleting the repo", function doIt(done) {
    var git=new Git(testrepo, "xuexi");
    git.clone()
      .then(function onResolve() {
        debug("changing permissions on cloned repo %s", git.gitDir);
        fs.chmodSync(git.gitDir, 0100);
        git.deleteRepo()
          .then(function onResolve() {
            should.fail('promise was resolved');
            done();
          }, function onReject(err) {
            debug("err:%j", err.code);
            err.should.be.ok;
            err.code.should.equal("EACCES");
            fs.existsSync(git.gitDir).should.be.ok;
            fs.chmodSync(git.gitDir, 0777);
            git.deleteRepo()
              .then(function onDeleteResolved() {
                done();
              });
          });
      });
  });
  it("should delete the named repo and resolve the returned promise", function doIt(done) {
    var Git=require('../lib/git'), testrepo="https://github.com/coyotebringsfire/xuexi.git";
        git=new Git(testrepo, "xuexi"), debug=require('debug')('test:git:deleteRepo:deleteRepoTestSuite:doIt');
    git.clone()
      .then(function onCloneResolved() {
        return git.deleteRepo();
      })
      .then(function onResolve() {
        fs.existsSync('/tmp/xuexi').should.not.be.ok;
        done();
      }, function onReject(err) {
        should.fail(new Error(err));
        done();
      });
  });
});