var rimraf=require('rimraf'),
    async=require('async'),
    Q=require('q');

module.exports=function deleteRepo() {
  var deletePromise=Q.defer(), _this=this;
  var log = require('./logger')(_this.module);
  log.info({repo:_this.gitDir}, "deleting repo");
  repo = _this.gitDir;
  if(!repo ) {
    async.setImmediate(function immediately() {
      log.error(new Error("repo has not been cloned"));
      deletePromise.reject(new Error("repo has not been cloned"));
    });
  } else {
    log.info("really deleting now");
    process.chdir(_this.xuexi_home);
    rimraf(repo, function(err) {
      log.info("DELETE DONE");
      if(err) {
        log.error(err);
        deletePromise.reject(err);
      } else {
        deletePromise.resolve({});      
      }
  
    });
  }
  return deletePromise.promise;
}