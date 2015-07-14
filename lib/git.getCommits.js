var Q=require('q'),
  Commit=require('./Commit'),
  async=require('async'),
  gitShow=require('git-show'),
  child_process=require('child_process');

module.exports=function getCommits() {
	var _this=this, commits={}, commitPromise=Q.defer();
	var log = require('./logger')(_this.module);

  if(!_this.gitDir) {
    log.info("about to reject the promise");
    async.setImmediate(function() {
      log.error(new Error("attempt to get commits for non-cloned repo"));
      commitPromise.reject(new Error("attempt to get commits for non-cloned repo"));
    });
  } else {
    log.info("xuexi_home %s", this.xuexi_home);

    log.info({gitDir:_this.gitDir}, "gitDir");
    // fork a child for calling git-history
    log.info({historyHelper:_this.xuexi_home+'/lib/gitHistoryHelper'}, "forking");
    var historyChild=child_process.fork(_this.xuexi_home+'/lib/gitHistoryHelper');
    historyChild.on('error', function(err) {
      log.error(err);
      commitPromise.reject(err);
    });
    historyChild.on('exit', function() {
      log.info({commits:commits}, "resolving history");
      _this.commits=commits;
      _this.processCommits=require('./git.processCommits');
      commitPromise.resolve(commits);
    });
    historyChild.on('message', function(msg) {
      log.info({message:msg}, "incoming message");
      commits=msg;
    });
    historyChild.send({ repo:_this.gitDir, module:_this.module });
  }

	return commitPromise.promise;
};