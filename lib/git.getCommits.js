var Q=require('q'),
	gitHistory=require('git-history'),
  Commit=require('./Commit'),
  async=require('async'),
  gitShow=require('git-show');

module.exports=function getCommits(repoDir) {
	var _this=this, commits={}, commitPromise=Q.defer(), showPromise=Q.defer(), history_ended=false, starting_cwd=process.cwd();
	var debug=require('debug')('xuexi:git:getCommits');

  if( repoDir===undefined ) {
    async.setImmediate( function() {
      commitPromise.reject(new Error("missing required repo dir"));
    });
    return commitPromise.promise;
  }
  _this.repoDir=repoDir;
	debug("history %s", repoDir);
  process.chdir(repoDir);
	var history=gitHistory(undefined, undefined, {cwd:repoDir});

	function onCommitEventHandler(_commit) {
		var debug=require('debug')('xuexi:git:getCommits:onResolveGetMasterCommit:onCommitEventHandler'), commit=_commit;
		if(commit) {
			commits[commit.hash] = new Commit(commit);
		} else {
			debug("null commit history");
		}
  }
  // Listen for commit events from the history.
  history.on("data", onCommitEventHandler);
  
  function onHistoryEnd() {
  	var debug=require('debug')('xuexi:git:getCommits:onResolveGetMasterCommit:onHistoryEnd');
  	
  	debug("history end %s", Object.keys(commits));
  	
    debug("all commits:\n%j", commits);
    debug("resolving commitPromise");
    _this.rawCommits=commits;
    commitPromise.resolve(commits);
  }

  history.on('end', onHistoryEnd);
	return commitPromise.promise;
};