"use strict";

var nodegit=require('nodegit'),
	async=require('async'),
	Q=require('q'),
	debug=require('debug')('git:debug');

function getCommits(repo) {
	var _this=this, commits=[], commitPromise=Q.defer();
	debug("opening repo");
	nodegit.Repository.open(repo)
		.then(function onResolveRepositoryOpen(repo) {
			debug("getMasterCommit");
			return repo.getMasterCommit();
		})
		.then(function onResolveGetMasterCommit(firstCommitOnMaster) {
			debug("history");
			var history = firstCommitOnMaster.history();

		    // Listen for commit events from the history.
		    history.on("commit", function onCommitEventHandler(commit) {
		    	var author = commit.author(),
		    		_commit={ 
			    		sha: commit.sha(),
			    		author: {
			    			name:author.name(), 
			    			email:author.email()
			    		},
			    		date: commit.date()
			    	};

		    	// Show the commit sha.
		    	debug("commit %s", _commit.sha);


		    	// Display author information.
		    	debug("Author:\t" + _commit.author.name + " <", _commit.author.email + ">");

		    	// Show the commit date.
		    	debug("Date:\t" + _commit.date);

		    	commit.getTree()
		    		.then( function onResolveGetTree(tree) {
		    			debug("tree gotten");
		    			_commit.diffs=[];
		    			async.times( commit.parents().length, function forEachCommit(parent, doneFindingDiffs) {
		    				debug("diffing with parents");
		    				tree.diff(parent)
		    					.then(function onResolveTreeDiff(differences) {
		    						debug("diffs gotten %j", differences);
		    						_commit.diffs.push(differences);
		    						doneFindingDiffs();
		    					});
		    			}, function afterAllDiffs(err) {
		    				debug("%j", _commit.diffs);
		    				commits.push(_commit);
		    			});
		    		});

		    });
		    
		    history.on('end', function onHistoryEnd() {
		    	debug("history end %j", commits);
		    	if( commits.length == 0 ) {
		    		commitPromise.reject(new Error("no commits"));
		    	} else {
		    		commitPromise.resolve(commits);
		    	}
		    });

		    // Start emitting events.
		    history.start();
		})
		.catch(function onErrorGetMasterCommit(err) {
			debug("error getMasterCommit: %j", err);
	    	commitPromise.reject(new Error(err));
	    })
	    .done();
	return commitPromise.promise;
}
/*
function processCommit(repo, _commit) {
	repo.getCommit( _commit.sha )
		.then(function onResolveRepositoryGetCommit(commit) {
			commit.parent()
				.then(function onResolveCommitParent(commitParent) {
					repo.diff(commit, commitParent);
				});
		});
}
*/

function processCommits(commits) {
	var processPromise=Q.defer(), trainedModel={};
	debug("processing commits %j", commits);
	processPromise.resolve(trainedModel);
	return processPromise.promise;
}

function train(options, callback) {
	debug("training");
	var trainPromise=Q.defer();
	if( arguments.length === 0 ) {
		debug("rejecting promise");
		trainPromise.reject(new Error("missing options"));
	} else if( !options.repo ) {
		debug("rejecting promise");
		trainPromise.reject(new Error("missing repo"));
		if( typeof callback == "function") {
			callback(new Error("missing repo"));
		}
	} else if( callback && typeof callback != 'function' ) {
		debug("rejecting promise");
		trainPromise.reject(new Error("invalid callback"));
	} else {
		//process the repo
		debug("processing repo");
		getCommits( options.repo )
			.then(function onResolveGetCommits(commits) {
				debug("commits %j", commits);
				return processCommits(commits);
			}, function onRejectGetCommits(err) {
				if( typeof callback == 'function' ) {
					callback(err);
				}
				trainPromise.reject(err);
			})
			.then(function onResolveProcessCommits(trainedModel) {
				trainPromise.resolve(trainedModel);
				if( typeof callback == 'function' ) {
					callback(null, trainedModel);
				}
			}, function onRejectProcessCommits() {
				if( typeof callback == 'function' ) {
					callback(err);
				}
				trainPromise.reject(err);
			});
	}
	return trainPromise.promise;
}

function predict() {}

module.exports={
	train: train,
	predict: predict
};