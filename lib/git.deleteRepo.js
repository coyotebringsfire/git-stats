var rimraf=require('rimraf'),
    async=require('async'),
    Q=require('q');

module.exports=function deleteRepo(repo) {
  var debug=require('debug')('xuexi:git:deleteRepo'), deletePromise=Q.defer(), _this=this;
  debug("deleting repo %s typeof %s", repo, typeof repo);
  repo = repo || _this.gitDir;
  if(!repo ) {
    debug("!repo");
    async.setImmediate(function immediately() {
      deletePromise.reject(new Error("missing required repo name"));
    });
  } else if( "string" != typeof repo ) {
    debug("!string");
    async.setImmediate(function immediately() {
      deletePromise.reject(new Error("invalid repo"));
    });
  } else {
    debug("really deleting now");
    rimraf(repo, function(err) {
      debug("DELETE DONE %j", err);
      if(err) {
        deletePromise.reject(err);
      } else {
        deletePromise.resolve({});      
      }
  
    });
  }
  return deletePromise.promise;
}