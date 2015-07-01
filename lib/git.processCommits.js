var Q=require('q'),
	gitShow=require('git-show'),
	ss=require('simple-statistics'),
	async=require('async'),
	Commit=require('./Commit');

module.exports=function processCommits(commits) {
	var debug=require('debug')('xuexi:git:processCommits'), _this=this;
	var processPromise=Q.defer();
	debug("commits:%j", commits);
	if(!commits) {
		debug("missing argument %j", commits);
		async.setImmediate(function rejectingPromise() {
			var debug=require('debug')('xuexi:git:processCommits:rejectingPromise');
			processPromise.reject(new Error("missing argument"));
		});
		return processPromise.promise;
	}
	if( (!commits instanceof Object) || commits instanceof Array) {
		debug("missing argument %j", commits);
		async.setImmediate(function rejectingPromise() {
			var debug=require('debug')('xuexi:git:processCommits:rejectingPromise');
			debug("promise rejected");
			processPromise.reject(new Error("first argument must be a hash"));
		});
		return processPromise.promise;
	}
	commits.commitAuthors=[];
	debug("processing commits %j", Object.keys(commits));
	async.eachLimit(Object.keys(commits), 1, function forEachCommit(commit,done) {
		var _commit=commit;
		var debug=require('debug')('xuexi:git:processCommits:forEachCommit');
		debug("processing commit %j", commits[_commit]);

		debug("_commit:%s", _commit);
		if( _commit === "commitAuthors" ) {
			debug("commit authors %j", commits["commitAuthors"]);
			return done();
		}

		var author=commits[_commit].author, 
			sha=_commit;
		
		if( author === undefined ) {
			debug("author %j", commits[_commit]);
		} else {
			debug("commitAuthors %j", commits["commitAuthors"]);
			if( commits["commitAuthors"].indexOf(author.email) === -1 ) {
				commits["commitAuthors"].push(author.email);
			}
		}
		debug("commit authors %j", commits["commitAuthors"]);
		//debug("showing commits for %s in %s", sha, _this.repoDir);
		process.chdir(_this.repoDir);
		gitShow({cwd:_this.repoDir, commit:sha})
			.then( function onGitShowSuccess(output) {
				var debug=require('debug')('xuexi:git:processCommits:forEachCommit:onGitShowSuccess');
				debug("git show success %s", output);
				if( !output ) {
					delete commits[_commit];
				} else {
					commits[_commit].showStats=output;
				}
				
				done();
			}, function onGitShowError(err) {
				var debug=require('debug')('xuexi:git:processCommits:forEachCommit:onGitShowError');
				debug("git show error %s", err.message);
				done(err);
			});
	}, function afterAllCommitsGotten(err) {
		var debug=require('debug')('xuexi:git:processCommits:forEachCommit'), authors=[];
		debug("calculating stats %j", commits);
		var totalAverageLinesChanged=0, totalAverageLinesAdded=0, totalAverageLinesDeleted=0,
			totalVarianceLinesChanged=0, totalVarianceLinesAdded=0, totalVarianceLinesDeleted=0,
			totalStandardDeviationLinesChanged=0, totalStandardDeviationLinesAdded=0, totalStandardDeviationLinesDeleted=0;
		var linesChanged=[], linesDeleted=[], linesAdded=[], c;
		for( c in commits ) {
			if( "commitAuthors" === c ) continue;
			debug("%s", c, commits[c].showStats );
			linesChanged.push( commits[c].showStats.averageLinesChanged );
			linesDeleted.push( commits[c].showStats.averageLinesDeleted );
			linesAdded.push( commits[c].showStats.averageLinesAdded );
		}
		debug("linesChanged %j", linesChanged);
		debug("linesDeleted %j", linesDeleted);
		debug("linesAdded %j", linesAdded);
		totalAverageLinesChanged=ss.mean(linesChanged);
		totalAverageLinesDeleted=ss.mean(linesDeleted);
		totalAverageLinesAdded=ss.mean(linesAdded);
		
		debug("commits %j", commits);
		debug("authors %j", commits.commitAuthors);
		commits.averageLinesChanged=totalAverageLinesChanged/commits.commitAuthors.length;
		commits.averageLinesDeleted=totalAverageLinesDeleted/commits.commitAuthors.length;
		commits.averageLinesAdded=totalAverageLinesAdded/commits.commitAuthors.length;
		commits.varianceLinesChanged=totalVarianceLinesChanged/commits.commitAuthors.length;
		commits.varianceLinesDeleted=totalVarianceLinesDeleted/commits.commitAuthors.length;
		commits.varianceLinesAdded=totalVarianceLinesAdded/commits.commitAuthors.length;
		commits.standardDeviationLinesChanged=totalStandardDeviationLinesChanged/commits.commitAuthors.length;
		commits.standardDeviationLinesDeleted=totalStandardDeviationLinesDeleted/commits.commitAuthors.length;
		commits.standardDeviationLinesAdded=totalStandardDeviationLinesAdded/commits.commitAuthors.length;
		debug("resolving promise %j", commits);
		processPromise.resolve(commits);
	});
	return processPromise.promise;
};