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
      log.error({cwd:process.cwd(), err:new Error("attempt to get commits for non-cloned repo")}, "error");
      commitPromise.reject(new Error("attempt to get commits for non-cloned repo"));
    });
  } else {
    log.info({cwd:process.cwd(), home:this.xuexi_home}, "xuexi_home");

    log.info({cwd:process.cwd(), gitDir:_this.gitDir}, "gitDir");
    // fork a child for calling git-history
    log.info({cwd:process.cwd(), historyHelper:_this.xuexi_home+'/lib/gitHistoryHelper'}, "forking");
    var historyChild=child_process.fork(_this.xuexi_home+'/lib/gitHistoryHelper');
    historyChild.on('error', function(err) {
      log.error({cwd:process.cwd(), err:err}, "historyChild error");
      commitPromise.reject(err);
    });
    historyChild.on('exit', function() {
      log.info({cwd:process.cwd(), commits:commits}, "resolving history");
      _this.commits=commits;
      log.info({cwd:process.cwd(), home:_this.xuexi_home}, "xuexi_home");
      _this.processCommits=require(_this.xuexi_home+'/lib/git.processCommits');
      commitPromise.resolve(_this.commits);
    });
    historyChild.on('message', function(msg) {
      log.info({cwd:process.cwd(), message:msg}, "incoming message");
      commits=msg;
    });
    historyChild.send({ repo:_this.gitDir, module:_this.module });
  }

	return commitPromise.promise;
};