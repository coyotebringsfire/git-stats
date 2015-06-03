//"use strict";

var Git=require('git-wrapper2'),
	git=new Git(),
	gitHistory=require('git-history'), //require('nodegit'),
	async=require('async'),
	Q=require('q'),
	fs=require('fs-plus'),
	debug=require('debug')('git:debug'),
	Commit=require('./Commit'),
	gitShow=require('git-show');

function getCommits(repo) {
	var _this=this, commits={}, commitPromise=Q.defer(), showPromise=Q.defer(), history_ended=false, starting_cwd=process.cwd();
	var debug=require('debug')('git:getCommits');

	process.chdir(repo);
	debug("history");
	var history=gitHistory();

	function onCommitEventHandler(_commit) {
		var debug=require('debug')('git:getCommits:onResolveGetMasterCommit:onCommitEventHandler'), commit=_commit;
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
    	var debug=require('debug')('git:getCommits:onResolveGetMasterCommit:onHistoryEnd');
    	function onResolveAllTreesReadyPromise() {
    		history_ended=true;
    		var debug=require('debug')('git:getCommits:onResolveGetMasterCommit:onHistoryEnd:onResolveAllTreesReadyPromise');
	    	debug("all commits:\n%j", commits);
	    	process.chdir(starting_cwd);
	    	debug("resolving commitPromise");
	    	commitPromise.resolve(commits);
	    }
	    function finishedProcessingCommitTreePromise(err) {
	    	var debug=require('debug')('git:getCommits:onResolveGetMasterCommit:onHistoryEnd:finishedProcessingCommitTreePromise');
    		debug("finishedProcessing");
    		commitTreePromise.resolve(true);
    	}
    	function processCommits(doneProcessingCommits) {
    		var debug=require('debug')('git:getCommits:onResolveGetMasterCommit:onHistoryEnd:processCommits');
    		function commitIterator(_commitID, doneProcessingCommit) {
    			var commitID=_commitID;
    			var debug=require('debug')('git:getCommits:onResolveGetMasterCommit:onHistoryEnd:doneProcessingCommits:commitIterator');
    			gitShow({commit:commitID}).
					then( function onResolveGitShow(stats) {
						var debug=require('debug')('git:getCommits:onResolveGetMasterCommit:onHistoryEnd:doneProcessingCommits:commitIterator:onResolveGitShow');
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
						var debug=require('debug')('git:getCommits:onResolveGetMasterCommit:onHistoryEnd:doneProcessingCommits:commitIterator:onRejectGitShow');
						debug("err: %j", err);
						debug("rejecting showPromise");
						showPromise.reject(err);
						debug("done processing commit %s", commitID);
						doneProcessingCommit(err);
					});
	    	}
	    	function afterProcessingCommits(err) {
	    		var debug=require('debug')('git:getCommits:onResolveGetMasterCommit:onHistoryEnd:doneProcessingCommits:afterProcessingCommits');
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
	var debug=require('debug')('git:processCommits');
	var processPromise=Q.defer(), trainedModel={}, commitAuthors=[];
	debug("processing commits %j", commits);
	// TODO calculate the mean number of changes in each commit, the variance and standard deviation
	async.each(Object.keys(commits),function forEachCommit(_commit, done) {
		var commit=_commit;
		commitAuthors.push(commit.author);
		done();
	}, function(err) {
		processPromise.resolve(trainedModel=commits);
	});
	return processPromise.promise;
}

function train(options, callback) {
	var debug=require('debug')('git:train');
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
					var debug=require('debug')('git:train:onResolveGetCommits');
					debug("commits %j", commits);
					return processCommits(commits);
				}, function onRejectGetCommits(err) {
					var debug=require('debug')('git:train:onRejectGetCommits');
					if( typeof callback == 'function' ) {
						callback(err);
					}
					trainPromise.reject(err);
				})
				.then(function onResolveProcessCommits(trainedModel) {
					debug=require('debug')('git:train:onResolveProcessCommits');
					debug("trainedModel %j", trainedModel);
					trainPromise.resolve(trainedModel);
					if( typeof callback == 'function' ) {
						callback(null, trainedModel);
					}
				}, function onRejectProcessCommits() {
					var debug=require('debug')('git:train:onRejectProcessCommits');
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