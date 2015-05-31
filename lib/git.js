//"use strict";

var gitHistory=require('git-history'), //require('nodegit'),
	async=require('async'),
	Q=require('q'),
	fs=require('fs-plus'),
	debug=require('debug')('git:debug'),
	Commit=require('./Commit');

function getCommits(repo) {
	var _this=this, commits={}, commitPromise=Q.defer(), history_ended=false, starting_cwd=process.cwd();
	debug=require('debug')('git:getCommits');

	process.chdir(repo);
	debug("history");
	var history=gitHistory();
	function onCommitEventHandler(commit) {
		debug=require('debug')('git:getCommits:onResolveGetMasterCommit:onCommitEventHandler');
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
    	debug=require('debug')('git:getCommits:onResolveGetMasterCommit:onHistoryEnd');
    	function onResolveAllTreesReadyPromise() {
    		history_ended=true;
    		debug=require('debug')('git:getCommits:onResolveGetMasterCommit:onHistoryEnd:onResolveAllTreesReadyPromise');
	    	debug("all commits:\n%j", commits);
	    	process.chdir(starting_cwd);
	    	commitPromise.resolve(commits);
	    }
	    function finishedProcessingCommitTreePromise(err) {
	    	debug=require('debug')('git:getCommits:onResolveGetMasterCommit:onHistoryEnd:finishedProcessingCommitTreePromise');
    		debug("finishedProcessing");
    		commitTreePromise.resolve(true);
    	}
    	function processCommits(doneProcessingCommits) {
    		debug=require('debug')('git:getCommits:onResolveGetMasterCommit:onHistoryEnd:processCommits');
    		function commitIterator(_commitID, doneProcessingCommit) {
    			debug=require('debug')('git:getCommits:onResolveGetMasterCommit:onHistoryEnd:doneRrocessingCommits:commitIterator');
    			debug("done processing commit %s", _commitID);
	    		doneProcessingCommit();
	    	}
	    	function afterProcessingCommits(err) {
	    		debug=require('debug')('git:getCommits:onResolveGetMasterCommit:onHistoryEnd:doneRrocessingCommits:afterProcessingCommits');
	    		debug("done processing all commits: error: %j", err);
	    		doneProcessingCommits(err);
	    	}
	    	async.eachSeries(Object.keys(commits), commitIterator, afterProcessingCommits);
    	}
    	
    	debug("history end %s", Object.keys(commits));
    	async.series([processCommits], finishedProcessingCommitTreePromise);

    	//TODO get diffs for the commits
    	Q.all( [commitTreePromise] )
	    	.then(onResolveAllTreesReadyPromise);
    }

    history.on('end', onHistoryEnd);
	
	return commitPromise.promise;
}

function processCommits(commits) {
	debug=require('debug')('git:processCommits');
	var processPromise=Q.defer(), trainedModel={};
	debug("processing commits %j", commits);
	// TODO calculate the mean number of changes in each commit, the variance and standard deviation
	processPromise.resolve(trainedModel=commits);
	return processPromise.promise;
}

function train(options, callback) {
	debug=require('debug')('git:train');
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
					debug=require('debug')('git:train:onResolveGetCommits');
					debug("commits %j", commits);
					return processCommits(commits);
				}, function onRejectGetCommits(err) {
					debug=require('debug')('git:train:onRejectGetCommits');
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
					debug=require('debug')('git:train:onRejectProcessCommits');
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