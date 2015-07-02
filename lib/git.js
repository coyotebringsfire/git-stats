//"use strict";

var debug=require('debug')('xuexi:git');
/*
function getCommits(repo) {
	var _this=this, commits={}, commitPromise=Q.defer(), showPromise=Q.defer(), history_ended=false, starting_cwd=process.cwd();
	var debug=require('debug')('xuexi:git:getCommits');

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
  	var debug=require('debug')('git:getCommits:onResolveGetMasterCommit:onHistoryEnd');
  	function onResolveAllTreesReadyPromise() {
  		history_ended=true;
  		var debug=require('debug')('git:getCommits:onResolveGetMasterCommit:onHistoryEnd:onResolveAllTreesReadyPromise');
    	debug("all commits:\n%j", commits);
    	process.chdir(starting_cwd);
    	debug("resolving commitPromise");
    	commitPromise.resolve(commits);
    }
    function onRejectAllTreesReadyPromise(err) {
    	var debug=require('debug')('git:getCommits:onResolveGetMasterCommit:onHistoryEnd:onRejectAllTreesReadyPromise');
  		debug("rejecting commitPromise");
			commitPromise.reject(err);
  	}
    function finishedProcessingCommitTreePromise(err) {
    	var debug=require('debug')('git:getCommits:onResolveGetMasterCommit:onHistoryEnd:finishedProcessingCommitTreePromise');
  		debug("finishedProcessing");
			if(err) {
				return commitTreePromise.reject(new Error(err));
			}
  		commitTreePromise.resolve(true);
  	}
  	function processCommits(doneProcessingCommits) {
  		var debug=require('debug')('git:getCommits:onResolveGetMasterCommit:onHistoryEnd:processCommits');
  		function commitIterator(_commitID, doneProcessingCommit) {
  			var commitID=_commitID;
  			var debug=require('debug')('git:getCommits:onResolveGetMasterCommit:onHistoryEnd:doneProcessingCommits:commitIterator');
  			gitShow({commit:commitID}).
					then( function onResolveGitShow(stats) {
						var debug=require('debug')('xuexi:git:getCommits:onResolveGetMasterCommit:onHistoryEnd:doneProcessingCommits:commitIterator:onResolveGitShow');
						debug("stats: %j", stats);
						if(stats) {
							commits[_commitID].averageLinesChanged=stats.averageLinesChanged;
							commits[_commitID].varianceLinesChanged=stats.varianceLinesChanged;
							commits[_commitID].standardDeviationLinesChanged=stats.standardDeviationLinesChanged;
						}
						debug("done processing commit %s", _commitID);
						doneProcessingCommit();
					}, function onRejectGitShow(err) {
						var debug=require('debug')('xuexi:git:getCommits:onResolveGetMasterCommit:onHistoryEnd:doneProcessingCommits:commitIterator:onRejectGitShow');
						debug("err: %j", err);
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

  	Q.all( [commitTreePromise.promise] )
    	.then(onResolveAllTreesReadyPromise, onRejectAllTreesReadyPromise);
  }
  history.on('end', onHistoryEnd);

	return Q.all([commitPromise.promise]);
}

function processCommits(commits) {
	var debug=require('debug')('xuexi:git:processCommits'),
			processPromise=Q.defer();
	if(!commits) {
		debug("missing argument %j", commits);
		setTimeout(function rejectingPromise() {
			var debug=require('debug')('xuexi:git:processCommits:rejectingPromise');
			processPromise.reject(new Error("missing argument"));
		}, 100);
		return processPromise.promise;
	}
	if( (!commits instanceof Object) || commits instanceof Array) {
		debug("missing argument %j", commits);
		setTimeout(function rejectingPromise() {
			var debug=require('debug')('xuexi:git:processCommits:rejectingPromise');
			debug("timeout fired");
			processPromise.reject(new Error("first argument must be a hash"));
		}, 100);
		return processPromise.promise;
	}
	commits.commitAuthors=[];

	debug("processing commits %j", Object.keys(commits));
	// TODO calculate the mean number of changes in each commit, the variance and standard deviation
	async.eachLimit(Object.keys(commits), 10, function forEachCommit( commit, done) {
		var _commit=commit;
		var debug=require('debug')('xuexi:git:processCommits:forEachCommit');
		if(_commit==="commitAuthors") {
			return done();
		}
		debug("commit %j", commits[_commit]);
		var author=commits[_commit].author, 
			sha=_commit;
		debug("processing commits %j", commits.commitAuthors);
		if( commits.commitAuthors.indexOf(author) === -1 ) {
			commits.commitAuthors.push(author);
		}
		debug("showing %s", sha);
		gitShow.show(sha)
			.then( function onGitShowSuccess(output) {
				var debug=require('debug')('xuexi:git:processCommits:forEachCommit:onGitShowSuccess');
				commits[commit].showStats=output;
				done();
			}, function onGitShowError(err) {
				var debug=require('debug')('xuexi:git:processCommits:forEachCommit:onGitShowError');
				debug("gitShow rejected %j", err);
				done(err);
			});
	}, function afterAllCommitsGotten(err) {
		var debug=require('debug')('xuexi:git:processCommits:forEachCommit');
		//TODO calculate the averages across all commits for lines changed, added, and removed
		var totalAverageLinesChanged, totalVarianceLinesChanged, totalStandardDeviationLinesChanged;
		//TODO refactor to use statistics module
		async.parallel([
			function calculateMeanLinesChanged(finished) {
				async.map(Object.keys(commits), function mapHash(commit) {
					return commits[commit].averageLinesChanged;
				}, function onMapComplete(err, results) {
					if(err) {
						return finished(new Error(err));
					}
					totalAverageLinesChanged=ss.mean(results);
					finished();
				});
			},
			function calculateVarianceLinesChanged(finished) {
				async.map(Object.keys(commits), function mapHash(commit) {
					return commits[commit].varianceLinesChanged;
				}, function onMapComplete(err, results) {
					if(err) {
						return finished(new Error(err));
					}
					totalVarianceLinesChanged=ss.mean(results);
					finished();
				});
			},
			function calculateStandardDeviationLinesChanged(finished) {
				async.map(Object.keys(commits), function mapHash(commit) {
					return commits[commit].standardDeviationLinesChanged;
				}, function onMapComplete(err, results) {
					if(err) {
						return finished(new Error(err));
					}
					totalStandardDeviationLinesChanged=ss.mean(results);
					finished();
				});
			}], function doneCalculatingProjectStats(err) {
				if(err) {
					return processPromise.reject(err);
				}
				processPromise.resolve(commits);
			});
	});
	return processPromise.promise;
}

function train(options, callback) {
	var debug=require('debug')('xuexi:git:train');
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
*/
function predict() {

}

function Git(repo) {
	debug("repo: %s", repo);
	if(repo===undefined) {
		debug("throwing error");
		throw new Error("missing required repo");
	} else {
		this.repo=repo;
	}
}
Git.prototype.clone=require('./git.clone');
Git.prototype.getCommits=require('./git.getCommits');
Git.prototype.processCommits=require('./git.processCommits');
Git.prototype.train=require('./git.train');
Git.prototype.deleteRepo=require('./git.deleteRepo');
Git.prototype.predict=function() {

};
module.exports=Git;
/*
module.exports={
	clone: require('./git.clone'),
	getCommits: require('./git.getCommits'),
	processCommits: require('./git.processCommits'),
	train: require('./git.train'),
	deleteRepo: require('./git.deleteRepo'),

	predict: predict
};
*/