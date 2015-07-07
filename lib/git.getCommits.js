var Q=require('q'),
  Commit=require('./Commit'),
  async=require('async'),
  gitShow=require('git-show'),
  child_process=require('child_process');

module.exports=function getCommits(repoDir) {
	var _this=this, commits={}, commitPromise=Q.defer();
	var debug=require('debug')('xuexi:git:getCommits');

  if( repoDir===undefined ) {
    async.setImmediate( function() {
      commitPromise.reject(new Error("missing required repo dir"));
    });
    return commitPromise.promise;
  }
  _this.repoDir=repoDir;
	debug("history %s", repoDir);
  // fork a child for calling git-history
  var historyChild=child_process.fork('./lib/gitHelper');
  historyChild.on('error', function(err) {
    commitPromise.reject(err);
  });
  historyChild.on('exit', function() {
    commitPromise.resolve(commits);
  });
  historyChild.on('message', function(msg) {
    commits=msg;
  });
  historyChild.send({ repo:repoDir });

	return commitPromise.promise;
};