var Q=require('q'),
	gitShow=require('git-show'),
	ss=require('simple-statistics');

module.exports=function processCommits(commits) {
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
};