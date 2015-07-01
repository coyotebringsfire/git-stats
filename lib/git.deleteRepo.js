var rimraf=require('rimraf'),
    Q=require('q');

module.exports=function deleteRepo(repo) {
  var debug=require('debug')('xuexi:git:deleteRepo'), deletePromise=Q.defer();
  debug("deleting repo %s", repo);
  rimraf(repo, function(err) {
    debug("DELETE DONE %j", err);
    deletePromise.resolve({});
  });
  return deletePromise.promise;
}