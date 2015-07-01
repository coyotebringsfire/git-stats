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
	debug("history");
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
  	/*
    function onResolveAllTreesReadyPromise() {
  		history_ended=true;
  		var debug=require('debug')('xuexi:git:getCommits:onResolveGetMasterCommit:onHistoryEnd:onResolveAllTreesReadyPromise');
    	debug("all commits:\n%j", commits);
    	process.chdir(starting_cwd);
    	debug("resolving commitPromise");
    	commitPromise.resolve(commits);
    }
    function finishedProcessingCommitTreePromise(err) {
    	var debug=require('debug')('xuexi:git:getCommits:onResolveGetMasterCommit:onHistoryEnd:finishedProcessingCommitTreePromise');
  		debug("finishedProcessing");
  		commitTreePromise.resolve(true);
  	}
  	function processCommits(doneProcessingCommits) {
  		var debug=require('debug')('xuexi:git:getCommits:onResolveGetMasterCommit:onHistoryEnd:processCommits');
  		function commitIterator(_commitID, doneProcessingCommit) {
  			var commitID=_commitID;
  			var debug=require('debug')('xuexi:git:getCommits:onResolveGetMasterCommit:onHistoryEnd:doneProcessingCommits:commitIterator');
  			gitShow({commit:commitID}).
					then( function onResolveGitShow(stats) {
						var debug=require('debug')('xuexi:git:getCommits:onResolveGetMasterCommit:onHistoryEnd:doneProcessingCommits:commitIterator:onResolveGitShow');
						debug("stats: %j", stats);
						commits[commitID].averageLinesChanged=stats.averageLinesChanged;
						commits[commitID].varianceLinesChanged=stats.varianceLinesChanged;
						commits[commitID].standardDeviationLinesChanged=stats.standardDeviationLinesChanged;
						commits[commitID].averageLinesAdded=stats.averageLinesAdded;
						commits[commitID].varianceLinesAdded=stats.varianceLinesAdded;
						commits[commitID].standardDeviationLinesAdded=stats.standardDeviationLinesAdded;
						commits[commitID].averageLinesDeleted=stats.averageLinesDeleted;
						commits[commitID].varianceLinesDeleted=stats.varianceLinesDeleted;
						commits[commitID].standardDeviationLinesDeleted=stats.standardDeviationLinesDeleted;
						debug("commit: %j", commits[commitID]);
						debug("resolving showPromise");
						showPromise.resolve(commitID);
						debug("done processing commit %s", commitID);
						doneProcessingCommit();
					}, function onRejectGitShow(err) {
						var debug=require('debug')('xuexi:git:getCommits:onResolveGetMasterCommit:onHistoryEnd:doneProcessingCommits:commitIterator:onRejectGitShow');
						debug("err: %j", err);
						debug("rejecting showPromise");
						showPromise.reject(err);
						debug("done processing commit %s", commitID);
						doneProcessingCommit(err);
					});
    	}
    	function afterProcessingCommits(err) {
    		var debug=require('debug')('xuexi:git:getCommits:onResolveGetMasterCommit:onHistoryEnd:doneProcessingCommits:afterProcessingCommits');
    		debug("done processing all commits: error: %j", err);
    		doneProcessingCommits(err);
    	}
    	async.eachSeries(Object.keys(commits), commitIterator, afterProcessingCommits);
  	}
  	*/
  	debug("history end %s", Object.keys(commits));
  	//async.series([processCommits], finishedProcessingCommitTreePromise);

  	//TODO get diffs for the commits
  	/*
    Q.all( [commitTreePromise.promise] )
    	.then(onResolveAllTreesReadyPromise);
    */
    debug("all commits:\n%j", commits);
    debug("resolving commitPromise");
    commitPromise.resolve(commits);
  }

  history.on('end', onHistoryEnd);
	//return Q.all([commitPromise.promise, showPromise.promise]);
	return commitPromise.promise;
};