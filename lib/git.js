//"use strict";

var Git=require('git-wrapper2'),
	git=new Git(),
	gitHistory=require('git-history'), //require('nodegit'),
	async=require('async'),
	Q=require('q'),
	fs=require('fs-plus'),
	debug=require('debug')('xuexi:git:debug'),
	Commit=require('./Commit'),
	gitShow=require('git-show'),
	ss=require('simple-statistics');

function getCommits(repo) {
	var _this=this, commits={}, commitPromise=Q.defer(), showPromise=Q.defer(), history_ended=false, starting_cwd=process.cwd();
	var debug=require('debug')('xuexi:git:getCommits');

	process.chdir(repo);
	debug("history");
	var history=gitHistory();

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
    	var commitTreePromise=Q.defer(), allTreesReadyPromise;
    	var debug=require('debug')('xuexi:git:getCommits:onResolveGetMasterCommit:onHistoryEnd');
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
    	
    	debug("history end %s", Object.keys(commits));
    	async.series([processCommits], finishedProcessingCommitTreePromise);

    	//TODO get diffs for the commits
    	Q.all( [commitTreePromise.promise] )
	    	.then(onResolveAllTreesReadyPromise);
    }

    history.on('end', onHistoryEnd);
	return Q.all([commitPromise.promise, showPromise.promise]);
	//return commitPromise.promise;
}

function processCommits(commits) {
	var debug=require('debug')('xuexi:git:processCommits');
	var processPromise=Q.defer();
	commits.commitAuthors=[];
	debug("processing commits %j", commits);
	// TODO calculate the mean number of changes in each commit, the variance and standard deviation
	async.eachLimit(10, Object.keys(commits),function forEachCommit(commit,done) {
		var _commit=commit;
		var debug=require('debug')('xuexi:git:processCommits:forEachCommit');
		var author=commits[commit].author, 
			sha=commits[commit].sha;
		if( commits.commitAuthors.indexOf(author) === -1 ) {
			commits.commitAuthors.push(author);
		}
		gitShow.show(sha)
			.then( function onGitShowSuccess(output) {
				var debug=require('debug')('xuexi:git:processCommits:forEachCommit:onGitShowSuccess');
				commits[commit].showStats=output;
				done();
			}, function onGitShowError(err) {
				var debug=require('debug')('xuexi:git:processCommits:forEachCommit:onGitShowError');
				done(err);
			});
	}, function afterAllCommitsGotten(err) {
		var debug=require('debug')('xuexi:git:processCommits:forEachCommit');
		//TODO calculate the averages across all commits for lines changed, added, and removed
		var totalAverageLinesChanged, totalAverageLinesAdded, totalAverageLinesDeleted,
			totalVarianceLinesChanged, totalVarianceLinesAdded, totalVarianceLinesDeleted,
			totalStandardDeviationLinesChanged, totalStandardDeviationLinesAdded, totalAStandardDeviationLinesDeleted;
		//TODO refactor to use statistics module
		totalAverageLinesChanged=ss.mean(commits);
		totalAverageLinesDeleted=ss.mean(commits);
		totalAverageLinesAdded=ss.mean(commits);

		for( c in commits ) {
			totalAverageLinesChanged+=commits[c].averageLinesChanged;
			totalAverageLinesDeleted+=commits[c].averageLinesDeleted;
			totalAverageLinesAdded+=commits[c].averageLinesAdded;
			totalVarianceLinesChanged+=commits[c].varianceLinesChanged;
			totalVarianceLinesDeleted+=commits[c].varianceLinesDeleted;
			totalVarianceLinesAdded+=commits[c].varianceLinesAdded;
			totalStandardDeviationLinesChanged+=commits[c].standardDeviationLinesChanged;
			totalStandardDeviationLinesDeleted+=commits[c].standardDeviationLinesDeleted;
			totalStandardDeviationLinesAdded+=commits[c].standardDeviationLinesAdded;
		}
		commits.averageLinesChanged=totalAverageLinesChanged/commits.commitAuthors.length;
		commits.averageLinesDeleted=totalAverageLinesDeleted/commits.commitAuthors.length;
		commits.averageLinesAdded=totalAverageLinesAdded/commits.commitAuthors.length;
		commits.varianceLinesChanged=totalVarianceLinesChanged/commits.commitAuthors.length;
		commits.varianceLinesDeleted=totalVarianceLinesDeleted/commits.commitAuthors.length;
		commits.varianceLinesAdded=totalVarianceLinesAdded/commits.commitAuthors.length;
		commits.standardDeviationLinesChanged=totalStandardDeviationLinesChanged/commits.commitAuthors.length;
		commits.standardDeviationLinesDeleted=totalAStandardDeviationLinesDeleted/commits.commitAuthors.length;
		commits.standardDeviationLinesAdded=totalStandardDeviationLinesAdded/commits.commitAuthors.length;

		processPromise.resolve(commits);
	});
	return processPromise.promise;
}

function train(options, callback) {
	var debug=require('debug')('xuexi:xuexi:git:train');
	debug("training");
	var trainPromise=Q.defer();
	if( arguments.length === 0 ) {
		debug("rejecting promise: missing options");
		trainPromise.reject(new Error("missing options"));
	} else if( !options.repo ) {
		debug("rejecting promise: missing repo");
		trainPromise.reject(new Error("missing repo"));
		if( typeof callback == "function") {
			callback(new Error("missing repo"));
		}
	} else if( callback && typeof callback != 'function' ) {
		debug("rejecting promise: invalid callback");
		trainPromise.reject(new Error("invalid callback"));
	} else {
		if(	!fs.isDirectorySync(options.repo) ) {
			debug("rejecting promise: invalid repo");
			trainPromise.reject(new Error("invalid callback"));
			if( callback ) {
				callback(new Error("invalid repo"));
			}
		} else {
			//process the repo
			debug("processing repo");
			getCommits( options.repo )
				.then(function onResolveGetCommits(commits) {
					var debug=require('debug')('xuexi:git:train:onResolveGetCommits');
					debug("commits %j", commits);
					return processCommits(commits);
				}, function onRejectGetCommits(err) {
					var debug=require('debug')('xuexi:git:train:onRejectGetCommits');
					if( typeof callback == 'function' ) {
						callback(err);
					}
					trainPromise.reject(err);
				})
				.then(function onResolveProcessCommits(trainedModel) {
					debug=require('debug')('xuexi:git:train:onResolveProcessCommits');
					debug("trainedModel %j", trainedModel);
					trainPromise.resolve(trainedModel);
					if( typeof callback == 'function' ) {
						callback(null, trainedModel);
					}
				}, function onRejectProcessCommits() {
					var debug=require('debug')('xuexi:git:train:onRejectProcessCommits');
					if( typeof callback == 'function' ) {
						callback(err);
					}
					trainPromise.reject(err);
				});
		}
	}
	return trainPromise.promise;
}

function predict() {}

module.exports={
	train: train,
	predict: predict
};